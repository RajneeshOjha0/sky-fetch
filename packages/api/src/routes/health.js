const express = require('express');
const router = express.Router();
const os = require('os');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/metrics', (req, res) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsageGB = (usedMem / (1024 * 1024 * 1024)).toFixed(1);

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
        }
    });
});

module.exports = router;
