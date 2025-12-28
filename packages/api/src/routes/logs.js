const express = require('express');
const { z } = require('zod');
const validate = require('../middlewares/validate');
const LogsController = require('../controllers/logs.controller');

const router = express.Router();

// Zod Schema for LogEvent (Moved definition here or could be in a shared validator file)
// Ideally, this should match the JSDoc in @skyfetch/shared
const LogEventSchema = z.object({
    id: z.string().uuid(),
    timestamp: z.string().datetime(),
    level: z.enum(['debug', 'info', 'warn', 'error']),
    message: z.string(),
    source: z.enum(['terminal', 'github', 'gitlab', 'ci']),
    sessionId: z.string().optional(),
    hostId: z.string().optional(),
    metadata: z.record(z.any()).optional(),
    traceId: z.string().optional(),
});

// Batch Schema
const BatchSchema = z.array(LogEventSchema);

// Search Schema
const SearchQuerySchema = z.object({
    q: z.string().optional(),
    level: z.enum(['debug', 'info', 'warn', 'error']).optional(),
    source: z.enum(['terminal', 'github', 'gitlab', 'ci']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

// GET /logs/search
router.get(
    '/search',
    validate(SearchQuerySchema, 'query'),
    LogsController.search
);

// POST /logs/batch
router.post(
    '/batch',
    validate(BatchSchema),
    LogsController.ingestBatch
);

module.exports = router;
