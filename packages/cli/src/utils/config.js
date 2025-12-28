const Conf = require('conf');

const schema = {
    apiUrl: {
        type: 'string',
        default: 'http://localhost:3000'
    },
    apiKey: {
        type: 'string',
        default: ''
    }
};

const config = new Conf({
    projectName: 'skyfetch',
    schema
});

module.exports = config;
