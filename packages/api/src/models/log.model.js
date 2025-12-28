const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    level: {
        type: String,
        enum: ['debug', 'info', 'warn', 'error'],
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: ['terminal', 'github', 'gitlab', 'ci'],
        required: true,
        index: true
    },
    sessionId: {
        type: String,
        index: true
    },
    hostId: {
        type: String,
        index: true
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    traceId: {
        type: String,
        index: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Compound index for common queries (e.g., "logs from terminal sorted by time")
LogSchema.index({ source: 1, timestamp: -1 });

module.exports = mongoose.model('Log', LogSchema);
