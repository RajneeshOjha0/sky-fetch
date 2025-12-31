const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// our system health check
router.get('/metrics', (req, res) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const processMemoryUsage = process.memoryUsage().rss;
    const memUsageGB = (usedMem / (1024 * 1024 * 1024)).toFixed(1);
    const { execSync } = require('child_process');
    let processListWithOver200MB = [];
    try {
        if (process.platform === 'win32') {
            const output = execSync('tasklist /FO CSV /NH').toString();
            processListWithOver200MB = output.trim().split('\r\n')
                .map(line => {
                    const parts = line.match(/^"(.+?)","(.+?)","(.+?)","(.+?)","(.+?)"$/);
                    if (!parts) return null;
                    const name = parts[1];
                    const pid = parseInt(parts[2]);
                    const memStr = parts[5].replace(/[, K"]/g, '');
                    const memoryMB = Math.round(parseInt(memStr) / 1024);
                    return { pid, name, memoryMB };
                })
                .filter(p => p && p.memoryMB > 200);
        } else {
            processListWithOver200MB = execSync('ps -eo pid,comm,rss --no-headers')
                .toString()
                .trim()
                .split('\n')
                .map(line => {
                    const [pid, name, rss] = line.trim().split(/\s+/);
                    return { pid: parseInt(pid), name, memoryMB: Math.round(parseInt(rss) / 1024) };
                })
                .filter(p => p.memoryMB > 200);
        }
    } catch (err) {
        console.error('Error fetching process list:', err.message);
    }


    // CPU Load (1 minute average)
    const loadAvg = os.loadavg()[0];
    const cpus = os.cpus().length;
    // Rough percentage estimation
    const cpuUsagePercent = Math.min(Math.round((loadAvg / cpus) * 100), 100);

    // DB Status
    const dbState = mongoose.connection.readyState; // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    const dbStatus = dbState === 1 ? 'connected' : 'disconnected';

    // Mock Ingest Rate (random variation around 2.4k)
    const baseRate = 2400;
    const randomVariation = Math.floor(Math.random() * 400) - 200; // +/- 200
    const ingestRate = baseRate + randomVariation;

    res.json({
        cpu: {
            usage: `${cpuUsagePercent}%`,
            status: cpuUsagePercent > 80 ? 'warning' : 'normal'
        },
        memory: {
            value: `${memUsageGB} GB`,
            status: (usedMem / totalMem) > 0.8 ? 'warning' : 'normal'
        },
        db: {
            connections: 85, // Mocked for now as pool size is hard to get reliably across drivers
            status: dbStatus === 'connected' ? 'normal' : 'error'
        },
        ingest: {
            rate: `${(ingestRate / 1000).toFixed(1)}k/s`,
            status: ingestRate > 3000 ? 'warning' : 'normal' // Arbitrary threshold
        },
        processMemoryUsage: {
            value: `${(processMemoryUsage / (1024 * 1024)).toFixed(1)} MB`,
            status: processMemoryUsage > 500 * 1024 * 1024 ?
                'warning' : 'normal'
        },
        processListWithOver200MB: {
            value: processListWithOver200MB,
            status: processListWithOver200MB.length > 0 ? 'warning' : 'normal'
        }
    });
});


module.exports = router;
