const { spawn } = require('child_process');
const path = require('path');
const chalk = require('chalk');

const CLI_PATH = path.resolve(__dirname, '../index.js');

console.log(chalk.cyan('Starting Resource Usage Audit...'));
console.log(chalk.dim('Target: ' + CLI_PATH));

const agent = spawn('node', [CLI_PATH, 'start'], {
    stdio: ['ignore', 'pipe', 'pipe']
});

const pid = agent.pid;
console.log(chalk.green(`Agent started with PID: ${pid}`));

const stats = [];
const DURATION_SECONDS = 30;
let seconds = 0;

const interval = setInterval(() => {
    try {
        const usage = process.memoryUsage(); // This gets usage of the *audit script*, not the child. 
        // To get child usage, we need a different approach or use a library like 'pidusage'.
        // For simplicity in this environment without adding more deps, we'll try to use 'tasklist' on Windows.

        const { exec } = require('child_process');
        exec(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, (err, stdout) => {
            if (!err && stdout.trim()) {
                // "node.exe","1234","Console","1","12,345 K"
                const parts = stdout.split(',');
                if (parts.length >= 5) {
                    const memStr = parts[4].replace(/"/g, '').replace(' K', '').replace(',', '').trim();
                    const memMb = parseInt(memStr) / 1024;

                    console.log(`[${seconds}s] Memory: ${memMb.toFixed(2)} MB`);
                    stats.push(memMb);
                }
            }
        });

        seconds++;
        if (seconds >= DURATION_SECONDS) {
            clearInterval(interval);
            agent.kill();
            finishAudit();
        }
    } catch (e) {
        console.error(e);
    }
}, 1000);

function finishAudit() {
    console.log(chalk.cyan('\n--- Audit Complete ---'));
    if (stats.length === 0) {
        console.log(chalk.red('No stats collected.'));
        return;
    }

    const max = Math.max(...stats);
    const avg = stats.reduce((a, b) => a + b, 0) / stats.length;

    console.log(`Peak Memory: ${chalk.bold(max.toFixed(2) + ' MB')}`);
    console.log(`Avg Memory:  ${chalk.bold(avg.toFixed(2) + ' MB')}`);

    if (max < 100) {
        console.log(chalk.green(' Memory usage is within limits (<100MB)'));
    } else {
        console.log(chalk.red(' Memory usage exceeded limits!'));
    }
}

// Handle agent output
agent.stdout.on('data', (data) => {
    // console.log(chalk.dim('[Agent]: ' + data.toString().trim()));
});

agent.stderr.on('data', (data) => {
    console.error(chalk.red('[Agent Err]: ' + data.toString().trim()));
});
