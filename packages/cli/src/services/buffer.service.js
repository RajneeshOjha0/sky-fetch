const ApiService = require('./api.service');
const chalk = require('chalk');

/**
 * Service responsible for buffering logs and flushing them to the API in batches.
 * Prevents network congestion by aggregating multiple log entries.
 */
class BufferService {
    /**
     * @param {number} flushIntervalMs - Time in milliseconds between auto-flushes.
     * @param {number} batchSize - Maximum number of logs to send in a single batch.
     */
    constructor(flushIntervalMs = 5000, batchSize = 10) {
        this.queue = [];
        this.flushIntervalMs = flushIntervalMs;
        this.batchSize = batchSize;
        this.timer = null;
        this.maxBufferSize = 1000; // Safety cap to prevent memory leaks
    }

    /**
     * Starts the auto-flush timer.
     */
    start() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.flush(), this.flushIntervalMs);
        console.log(chalk.dim(`Buffer initialized. Flush interval: ${this.flushIntervalMs}ms, Batch size: ${this.batchSize}`));
    }

    /**
     * Stops the auto-flush timer and flushes any remaining logs.
     */
    stop() {
        if (this.timer) clearInterval(this.timer);
        this.flush();
    }

    /**
     * Adds a log entry to the buffer.
     * @param {Object} log - The log entry to add.
     */
    add(log) {
        if (this.queue.length >= this.maxBufferSize) {
            // Drop oldest log to maintain memory stability
            this.queue.shift();
        }
        this.queue.push(log);

        if (this.queue.length >= this.batchSize) {
            this.flush();
        }
    }

    /**
     * Flushes the current buffer to the API.
     */
    async flush() {
        if (this.queue.length === 0) return;

        const batch = [...this.queue];
        this.queue = []; // Clear queue immediately to prevent duplicates

        try {
            await ApiService.sendBatch(batch);
            console.log(chalk.green(`Successfully flushed ${batch.length} logs to API.`));
        } catch (error) {
            console.error(chalk.red(`Flush operation failed: ${error.message}`));
            // Note: We do not re-queue failed logs to avoid potential infinite loops during persistent outages.
        }
    }
}

module.exports = BufferService;
