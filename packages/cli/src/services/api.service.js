const axios = require('axios');
const config = require('../utils/config');
const chalk = require('chalk');

class ApiService {
    constructor() {
        const apiKey = config.get('apiKey');
        this.client = axios.create({
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });
    }

    getBaseUrl() {
        return config.get('apiUrl') || 'http://localhost:3000';
    }

    async sendBatch(logs) {
        try {
            const url = `${this.getBaseUrl()}/logs/batch`;
            const response = await this.client.post(url, logs);
            return response.data;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error(`Could not connect to API at ${this.getBaseUrl()}`);
            }
            if (error.response) {
                throw new Error(`API Error: ${error.response.status} ${error.response.statusText}`);
            }
            throw error;
        }
    }
}

module.exports = new ApiService();
