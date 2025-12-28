const Log = require('../models/log.model');

/**
 * Service for handling log-related business logic
 */
class LogsService {
    /**
     * Process a batch of logs
     * @param {Array<import('@skyfetch/shared').LogEvent>} logs 
     * @returns {Promise<{ processed: number }>}
     */
    static async processBatch(logs) {
        console.log(`[LogsService] Processing batch of ${logs.length} logs`);

        try {
            // Bulk insert for performance
            // ordered: false ensures that if one fails, others still get inserted
            await Log.insertMany(logs, { ordered: false });

            return {
                processed: logs.length
            };
        } catch (error) {
            console.error('[LogsService] Error inserting logs:', error);
            throw error;
        }
    }
}

module.exports = LogsService;
