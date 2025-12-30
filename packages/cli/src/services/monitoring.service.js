const os = require('os');
const ApiService = require('./api.service');
const chalk = require('chalk');

/**
 * Service responsible for collecting and sending system metrics.
 */
class MonitoringService {
    constructor(intervalMs = 15000) {
        this.intervalMs = intervalMs;
        this.timer = null;
    }

    /**
     * Starts the monitoring loop.
     */
    start() {
        if (this.timer) clearInterval(this.timer);

        console.log(chalk.dim(`System monitoring started. Interval: ${this.intervalMs}ms`));

        // Initial run
        this.collectAndSend();

        this.timer = setInterval(() => this.collectAndSend(), this.intervalMs);
    }

    /**
     * Stops the monitoring loop.
     */
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
            console.log(chalk.dim('System monitoring stopped.'));
        }
    }

    /**
     * Collects system metrics and sends them to the API.
     */
    async collectAndSend() {
        try {
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const memUsagePercent = Math.round((usedMem / totalMem) * 100);

            const loadAvg = os.loadavg()[0];
            const cpus = os.cpus().length;
            const cpuUsagePercent = Math.min(Math.round((loadAvg / cpus) * 100), 100);

            await ApiService.sendMetrics({
                cpu: cpuUsagePercent,
                memory: memUsagePercent,
                memoryUsedGB: (usedMem / (1024 * 1024 * 1024)).toFixed(2)
            });
        } catch (error) {
            // Suppress errors to avoid spamming console, ApiService already logs if needed
        }
    }
}

module.exports = MonitoringService;
