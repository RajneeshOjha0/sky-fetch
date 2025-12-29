const mongoose = require('mongoose');
const crypto = require('crypto');

const apiKeySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUsedAt: {
        type: Date
    }
});

// Helper to generate a secure random key
apiKeySchema.statics.generate = function () {
    return 'sk_' + crypto.randomBytes(24).toString('hex');
};

module.exports = mongoose.model('ApiKey', apiKeySchema);
