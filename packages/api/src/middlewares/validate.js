const { z } = require('zod');

/**
 * Middleware to validate request data against a Zod schema
 * @param {z.ZodSchema} schema - The Zod schema to validate against
 * @param {'body' | 'query' | 'params'} source - The part of the request to validate (default: 'body')
 */
const validate = (schema, source = 'body') => (req, res, next) => {
    try {
        const data = req[source];
        const validatedData = schema.parse(data);
        req[source] = validatedData; // Replace with validated (and potentially transformed) data
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Validation Error',
                details: error.errors,
            });
        }
        next(error);
    }
};

module.exports = validate;
