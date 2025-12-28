const LogsService = require('../services/logs.service');
const SearchService = require('../services/search.service');
const catchAsync = require('../utils/catchAsync');

class LogsController {
    /**
     * Search logs
     */
    static search = catchAsync(async (req, res, next) => {
        const { q, level, source, startDate, endDate, page, limit } = req.query;

        const result = await SearchService.searchLogs(
            q,
            { level, source, startDate, endDate },
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
        const result = await LogsService.processBatch(logs);

        res.status(202).json({
            status: 'accepted',
            ...result
        });
    });
}

module.exports = LogsController;
