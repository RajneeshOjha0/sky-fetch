const AppError = require('../utils/AppError');
const ApiKey = require('../models/apikey.model');
const catchAsync = require('../utils/catchAsync');

const auth = catchAsync(async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return next(new AppError('API Key is missing. Please provide x-api-key header.', 401));
    }

    const keyDoc = await ApiKey.findOne({ key: apiKey, isActive: true });

    if (!keyDoc) {
        return next(new AppError('Invalid or inactive API Key.', 401));
    }

    // Update last used timestamp (fire and forget, don't await to keep it fast)
    keyDoc.lastUsedAt = new Date();
    keyDoc.save().catch(err => console.error('Failed to update API key stats:', err));

    // Attach key info to request
    req.apiKey = keyDoc;
    next();
});

module.exports = auth;
