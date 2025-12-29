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
        const logs = req.body;
        const apiKey = req.apiKey; // Attached by auth middleware
        const user = apiKey.user;  // Populated in auth middleware

        // Inject tenant info into each log entry
        const enrichedLogs = logs.map(log => ({
            ...log,
            user: user._id,
            apiKey: apiKey._id,
            organization: user.organization,
            project: user.project
        }));

        const result = await LogsService.processBatch(enrichedLogs);

        res.status(202).json({
            status: 'accepted',
            ...result
        });
    });
}

module.exports = LogsController;
