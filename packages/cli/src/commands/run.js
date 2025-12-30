const spawn = require('cross-spawn');
const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');
const BufferService = require('../services/buffer.service');
const config = require('../utils/config');
const MonitoringService = require('../services/monitoring.service');

module.exports = async (command, options) => {
    // Reconstruct the full command string for display/logging
    const fullCommand = command.join(' ');
    if (!fullCommand) {
        console.error(chalk.red('Error: No command provided.'));
        return;
    }

    // Determine exclude pattern: CLI flag > Config > Null
    const excludePattern = options.exclude || config.get('exclude');

    // Compile exclude regex if provided
    let excludeRegex = null;
    if (excludePattern) {
        try {
            excludeRegex = new RegExp(excludePattern);
            console.log(chalk.dim(`Excluding logs matching: ${excludePattern}`));
        } catch (e) {
            console.error(chalk.red(`Error: Invalid regex pattern: ${excludePattern}`));
            return;
        }
    }

    console.log(chalk.cyan(`> Running: ${fullCommand}`));

    const bufferService = new BufferService();
    bufferService.start();

    // Start System Monitoring
    const monitoringService = new MonitoringService();
    monitoringService.start();

    // Split command for spawn
    const [cmd, ...cmdArgs] = command;

    const child = spawn(cmd, cmdArgs, {
        stdio: 'pipe',
        shell: true, // Use shell to support things like 'npm run dev' directly
        env: process.env
    });

    const captureLog = (data, level) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            if (!line.trim()) return;

            // Print to console (passthrough) - ALWAYS print to console so user sees output
            if (level === 'error') {
                process.stderr.write(line + '\n');
            } else {
                process.stdout.write(line + '\n');
            }

            // Filter log before buffering
            if (excludeRegex && excludeRegex.test(line)) {
                return;
            }

            // Buffer log
            bufferService.add({
                id: uuidv4(),
                timestamp: new Date().toISOString(),
                level: level === 'error' ? 'error' : 'info',
                message: line.trim(),
                source: 'terminal',
                metadata: {
                    command: fullCommand,
                    pid: child.pid
                }
            });
        });
    };

    child.stdout.on('data', (data) => captureLog(data, 'info'));
    child.stderr.on('data', (data) => captureLog(data, 'error'));

    child.on('close', async (code) => {
        console.log(chalk.dim(`\nCommand exited with code ${code}`));

        // Stop monitoring
        monitoringService.stop();

        // Flush remaining logs and exit
        await bufferService.stop();
        process.exit(code);
    });

    // Handle signals
    process.on('SIGINT', () => {
        monitoringService.stop();
        child.kill('SIGINT');
    });
    process.on('SIGTERM', () => {
        monitoringService.stop();
        child.kill('SIGTERM');
    });
};
