const LogsService = require('../services/logs.service');

class LogsController {
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
