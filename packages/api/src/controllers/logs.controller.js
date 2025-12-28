const LogsService = require('../services/logs.service');
const SearchService = require('../services/search.service');

class LogsController {
    /**
     * Search logs
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     * @param {import('express').NextFunction} next 
     */
    static async search(req, res, next) {
        try {
            const { q, level, source, startDate, endDate, page, limit } = req.query;

            const result = await SearchService.searchLogs(
                q,
                { level, source, startDate, endDate },
                parseInt(page) || 1,
                parseInt(limit) || 50
            );

            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Handle batch ingest request
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     * @param {import('express').NextFunction} next 
     */
    static async ingestBatch(req, res, next) {
        try {
            const logs = req.body;
            const result = await LogsService.processBatch(logs);

            res.status(202).json({
                status: 'accepted',
                ...result
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = LogsController;
