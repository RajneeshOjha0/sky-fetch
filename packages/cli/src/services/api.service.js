const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const config = require('../utils/config');
const chalk = require('chalk');

/**
 * Service responsible for communicating with the SkyFetch API.
 * Handles authentication and automatic retries for network failures.
 */
class ApiService {
    constructor() {
        const apiKey = config.get('apiKey');

        this.client = axios.create({
            timeout: 10000, // Increased timeout for reliability
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });

        // Configure exponential backoff retry strategy
        axiosRetry(this.client, {
            retries: 3,
            retryDelay: axiosRetry.exponentialDelay,
            retryCondition: (error) => {
                // Retry on network errors or 5xx server errors
                return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                    (error.response && error.response.status >= 500);
            }
        });
    }

    /**
     * Retrieves the configured API base URL.
     * @returns {string} The base URL.
     */
    getBaseUrl() {
        return config.get('apiUrl') || 'http://localhost:3000';
    }

    /**
     * Sends a batch of logs to the API.
     * @param {Array} logs - Array of log objects.
     * @returns {Promise<Object>} The API response data.
     * @throws {Error} If the request fails after retries.
     */
    async sendBatch(logs) {
        try {
            const url = `${this.getBaseUrl()}/logs/batch`;
            const response = await this.client.post(url, logs);
            return response.data;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error(`Connection refused: Unable to reach API at ${this.getBaseUrl()}`);
            }
            if (error.response) {
                // Handle specific HTTP error codes if needed
                if (error.response.status === 401) {
                    throw new Error('Authentication failed: Invalid API Key.');
                }
                throw new Error(`API Request failed with status ${error.response.status}: ${error.response.statusText}`);
            }
            throw error;
        }
    }
}

module.exports = new ApiService();
