const Log = require('../models/log.model');

class SearchService {
    /**
     * Search logs using MongoDB Atlas Search
     * @param {string} query - The search term
     * @param {Object} filters - Optional filters (level, source, etc.)
     * @param {number} page - Page number (1-based)
     * @param {number} limit - Items per page
     */
    static async searchLogs(query, filters = {}, page = 1, limit = 50) {
        const skip = (page - 1) * limit;

        const pipeline = [];

        // 1. $search stage (MUST be first)
        if (query) {
            pipeline.push({
                $search: {
                    index: 'default',
                    text: {
                        query: query,
                        path: {
                            wildcard: '*' // Search all indexed fields
                        },
                        fuzzy: {} // Enable typo tolerance
                    }
                }
            });
        } else {
            // If no query, just match all (or rely on filters)
            // Note: $search is usually for text. If only filters, we might use standard $match
            // But for consistency with Atlas Search features (like scoring), we can use "wildcard" or just skip $search if empty
        }

        // 2. $match stage for structured filters
        const matchStage = {};
        if (filters.level) matchStage.level = filters.level;
        if (filters.source) matchStage.source = filters.source;
        if (filters.organization) matchStage.organization = filters.organization;
        if (filters.project) matchStage.project = filters.project;

        // Date range filter
        if (filters.startDate || filters.endDate) {
            matchStage.timestamp = {};
            if (filters.startDate) matchStage.timestamp.$gte = new Date(filters.startDate);
            if (filters.endDate) matchStage.timestamp.$lte = new Date(filters.endDate);
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        // 3. Pagination & Sorting
        // If using $search, we get a "score". We usually want to sort by score then date.
        pipeline.push({
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [
                    { $skip: skip },
                    { $limit: limit },
                    // Project score if searching
                    ...(query ? [{ $addFields: { score: { $meta: 'searchScore' } } }] : [])
                ]
            }
        });

        const results = await Log.aggregate(pipeline);

        const metadata = results[0].metadata[0] || { total: 0 };
        const data = results[0].data || [];

        return {
            data,
            pagination: {
                total: metadata.total,
                page,
                limit,
                pages: Math.ceil(metadata.total / limit)
            }
        };
    }
}

module.exports = SearchService;
