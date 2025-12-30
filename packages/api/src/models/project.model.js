const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    metrics: {
        cpu: { type: Number, default: 0 },
        memory: { type: Number, default: 0 }, // in GB or percentage? Let's say percentage for consistency with alert
        memoryUsedGB: { type: Number, default: 0 },
        lastUpdated: { type: Date }
    },
    lastAlertSentAt: {
        type: Date
    }
});

module.exports = mongoose.model('Project', projectSchema);
