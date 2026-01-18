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

    /**
     * Get logs around a specific log entry (context view)
     * @param {string} logId - The ID of the log entry
     * @param {string} organization - Organization ID for tenant isolation
     * @param {number} before - Number of logs to fetch before
     * @param {number} after - Number of logs to fetch after
     * @returns {Promise<{ targetLog: object, before: Array, after: Array }>}
     */
    static async getLogContext(logId, organization, before = 10, after = 10) {
        console.log(`[LogsService] Getting context for log ${logId}`);

        try {
            // Find the target log
            const targetLog = await Log.findOne({ id: logId, organization });

            if (!targetLog) {
                throw new Error('Log not found');
            }

            const targetTimestamp = new Date(targetLog.timestamp);

            // Get logs before (same session/host if available, or just by time)
            const beforeLogs = await Log.find({
                organization,
                timestamp: { $lt: targetTimestamp },
                ...(targetLog.sessionId && { sessionId: targetLog.sessionId })
            })
                .sort({ timestamp: -1 })
                .limit(before);

            // Get logs after
            const afterLogs = await Log.find({
                organization,
                timestamp: { $gt: targetTimestamp },
                ...(targetLog.sessionId && { sessionId: targetLog.sessionId })
            })
                .sort({ timestamp: 1 })
                .limit(after);

            return {
                targetLog,
                before: beforeLogs.reverse(), // Reverse to show chronologically
                after: afterLogs
            };
        } catch (error) {
            console.error('[LogsService] Error getting log context:', error);
            throw error;
        }
    }
}

module.exports = LogsService;
