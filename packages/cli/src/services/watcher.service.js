const chokidar = require('chokidar');
const fs = require('fs');
const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');

/**
 * Service responsible for monitoring the shell history file for changes.
 * Captures new lines and forwards them to the BufferService.
 */
class WatcherService {
    /**
     * @param {string} historyPath - Absolute path to the shell history file.
     * @param {BufferService} bufferService - Instance of BufferService to receive logs.
     */
    constructor(historyPath, bufferService) {
        this.historyPath = historyPath;
        this.bufferService = bufferService;
        this.watcher = null;
        this.lastSize = 0;
    }

    /**
     * Starts watching the history file.
     */
    async start() {
        if (!this.historyPath || !fs.existsSync(this.historyPath)) {
            console.error(chalk.red(`Error: History file not found at path: ${this.historyPath}`));
            return;
        }

        // Initialize lastSize to current file size to avoid re-processing existing history
        try {
            const stats = fs.statSync(this.historyPath);
            this.lastSize = stats.size;
        } catch (error) {
            console.error(chalk.red(`Error accessing history file: ${error.message}`));
            return;
        }

        console.log(chalk.blue(`Monitoring history file: ${this.historyPath}`));

        this.watcher = chokidar.watch(this.historyPath, {
            persistent: true,
            usePolling: true,
            interval: 2000 // Polling interval optimized for resource usage
        });

        this.watcher.on('change', () => this.onFileChange());
        this.watcher.on('error', (error) => console.error(chalk.red(`Watcher error: ${error.message}`)));
    }

    /**
     * Handler for file change events.
     * Reads new content appended to the file.
     */
    onFileChange() {
        try {
            const stats = fs.statSync(this.historyPath);
            const newSize = stats.size;

            if (newSize > this.lastSize) {
                const stream = fs.createReadStream(this.historyPath, {
                    start: this.lastSize,
                    end: newSize
                });

                stream.on('data', (chunk) => {
                    const lines = chunk.toString().split('\n').filter(line => line.trim());
                    lines.forEach(line => {
                        const command = line.trim();
                        console.log(chalk.dim(`[Captured] ${command}`));

                        const logEvent = {
                            id: uuidv4(),
                            timestamp: new Date().toISOString(),
                            level: 'info',
                            message: command,
                            source: 'terminal',
                            metadata: {
                                type: 'history_capture'
                            }
                        };

                        this.bufferService.add(logEvent);
                    });
                });

                stream.on('error', (error) => {
                    console.error(chalk.red(`Stream read error: ${error.message}`));
                });

                this.lastSize = newSize;
            } else if (newSize < this.lastSize) {
                // File was truncated (e.g., history cleared)
                this.lastSize = newSize;
            }
        } catch (error) {
            console.error(chalk.red(`Error processing file change: ${error.message}`));
        }
    }
}

module.exports = WatcherService;
