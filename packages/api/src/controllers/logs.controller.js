const LogsService = require('../services/logs.service');
const SearchService = require('../services/search.service');
const catchAsync = require('../utils/catchAsync');

class LogsController {
    /**
     * Search logs
     */
    static search = catchAsync(async (req, res, next) => {
        const { q, level, source, from, to, page, limit, organization, project } = req.query;
        const user = req.user; // Attached by verify token middleware

        // Force organization filter to match user's org (Isolation)
        const tenantFilters = {
            level,
            source,
            startDate: from,
            endDate: to,
            // If user provides org/project, use it IF it matches their own (or just force theirs)
            // For strict isolation, we override or ensure matches.
            // Simplified: We force the search to be scoped to the User object's ID 
            // OR we match organization string if we trust the string in DB. 
            // Better: Filter by `user: user._id` OR `organization: user.organization`

            organization: user.organization, // Always filter by user's org
            project: project || undefined // Optional project filter within that org
        };

        const result = await SearchService.searchLogs(
            q,
            tenantFilters,
            parseInt(page) || 1,
            parseInt(limit) || 50
        );

        res.json(result);
    });

    /**
     * Handle batch ingest request
     */
    static ingestBatch = catchAsync(async (req, res, next) => {
        console.log('--- Ingest Batch Request ---');
        // console.log('Headers:', req.headers);
        // console.log('API Key Object:', req.apiKey);

        const logs = req.body;
        const apiKey = req.apiKey; // Attached by auth middleware

        // DEBUG: Check if user exists
        if (!apiKey.createdBy) {
            console.error('CRITICAL: apiKey.createdBy is undefined! Check auth middleware populate.');
        }

        const user = apiKey.createdBy || { _id: 'anonymous', organization: 'default', project: 'default' };

        // Inject tenant info into each log entry
        const enrichedLogs = logs.map(log => ({
            ...log,
            user: user._id,
            apiKey: apiKey._id,
            organization: user.organization,
            project: user.project
        }));

        console.log(`Processing ${enrichedLogs.length} logs...`);

        const result = await LogsService.processBatch(enrichedLogs);

        console.log('Batch processed successfully');

        res.status(202).json({
            status: 'accepted',
            ...result
        });
    });
    /**
     * Handle metrics ingest request
     */
    static ingestMetrics = catchAsync(async (req, res, next) => {
        const metrics = req.body;
        const apiKey = req.apiKey;
        const Project = require('../models/project.model');
        const EmailService = require('../services/email.service');
        const mongoose = require('mongoose');

        // Update Project
        const project = await Project.findById(apiKey.project);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.metrics = {
            ...metrics,
            lastUpdated: new Date()
        };

        // Check Thresholds & Alert
        const CPU_THRESHOLD = 90;
        const RAM_THRESHOLD = 90;
        const ALERT_COOLDOWN = 1000 * 60 * 60; // 1 hour

        const now = new Date();
        const lastAlert = project.lastAlertSentAt ? new Date(project.lastAlertSentAt) : new Date(0);

        if (now - lastAlert > ALERT_COOLDOWN) {
            let alertSent = false;
            // Get user email - apiKey.createdBy is the user
            const User = require('../models/user.model');
            const user = await User.findById(apiKey.createdBy);

            if (user) {
                if (metrics.cpu > CPU_THRESHOLD) {
                    await EmailService.sendResourceAlert(user.email, 'CPU', metrics.cpu, CPU_THRESHOLD);
                    alertSent = true;
                } else if (metrics.memory > RAM_THRESHOLD) {
                    await EmailService.sendResourceAlert(user.email, 'Memory', metrics.memory, RAM_THRESHOLD);
                    alertSent = true;
                }
            }

            if (alertSent) {
                project.lastAlertSentAt = now;
            }
        }

        await project.save();

        res.status(200).json({ status: 'ok' });
    });

    /**
     * Get logs around a specific log entry (context view)
     */
    static getContext = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const { before = 10, after = 10 } = req.query;
        const user = req.user;

        const result = await LogsService.getLogContext(
            id,
            user.organization,
            parseInt(before),
            parseInt(after)
        );

        res.json(result);
    });
}

module.exports = LogsController;
