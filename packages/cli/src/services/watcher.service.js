const chokidar = require('chokidar');
const fs = require('fs');
const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');

class WatcherService {
    constructor(historyPath, bufferService) {
        this.historyPath = historyPath;
        this.bufferService = bufferService;
        this.watcher = null;
        this.lastSize = 0;
    }

    async start() {
        if (!this.historyPath || !fs.existsSync(this.historyPath)) {
            console.error(chalk.red(`History file not found at: ${this.historyPath}`));
            return;
        }

        // Get initial file size to avoid reading the whole history
        const stats = fs.statSync(this.historyPath);
        this.lastSize = stats.size;

        console.log(chalk.blue(`Watching history file: ${this.historyPath}`));

        this.watcher = chokidar.watch(this.historyPath, {
            persistent: true,
            usePolling: true,
            interval: 2000
        });

        this.watcher.on('change', () => this.onFileChange());
    }

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

                this.lastSize = newSize;
            } else if (newSize < this.lastSize) {
                this.lastSize = newSize;
            }
        } catch (error) {
            console.error(chalk.red('Error reading history update:', error));
        }
    }
}

module.exports = WatcherService;
