const ApiService = require('./api.service');
const chalk = require('chalk');

class BufferService {
    constructor(flushIntervalMs = 5000, batchSize = 10) {
        this.queue = [];
        this.flushIntervalMs = flushIntervalMs;
        this.batchSize = batchSize;
        this.timer = null;
    }

    start() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => this.flush(), this.flushIntervalMs);
        console.log(chalk.dim(`Buffer started (Flush: ${this.flushIntervalMs}ms, Batch: ${this.batchSize})`));
    }

    stop() {
        if (this.timer) clearInterval(this.timer);
        this.flush(); // Flush remaining items
    }

    add(log) {
        if (this.queue.length >= 1000) {
            // Buffer full, drop oldest log or just stop adding? 
            // Dropping oldest is usually better for "live" tail, but stopping adding preserves history order.
            // Let's drop the oldest to prevent OOM.
            this.queue.shift();
        }
        this.queue.push(log);
        if (this.queue.length >= this.batchSize) {
            this.flush();
        }
    }

    async flush() {
        if (this.queue.length === 0) return;

        const batch = [...this.queue];
        this.queue = []; // Clear queue immediately

        try {
            await ApiService.sendBatch(batch);
            console.log(chalk.green(`✓ Flushed ${batch.length} logs to API`));
        } catch (error) {
            console.error(chalk.red(`Failed to flush logs: ${error.message}`));
            // Optional: Re-queue failed logs (be careful of infinite loops)
            // this.queue.unshift(...batch); 
        }
    }
}

module.exports = BufferService;
