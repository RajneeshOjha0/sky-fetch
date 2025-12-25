/**
 * @typedef {'debug' | 'info' | 'warn' | 'error'} LogLevel
 * @typedef {'terminal' | 'github' | 'gitlab' | 'ci'} LogSource
 * 
 * @typedef {Object} LogEvent
 * @property {string} id - Unique ID of the log entry (UUID v4)
 * @property {string} timestamp - ISO 8601 timestamp
 * @property {LogLevel} level - Log level
 * @property {string} message - Log message
 * @property {LogSource} source - Source of the log
 * @property {string} [sessionId] - Session ID
 * @property {string} [hostId] - Host ID
 * @property {Object.<string, any>} [metadata] - Structured metadata
 * @property {string} [traceId] - Trace ID
 */

module.exports = {};