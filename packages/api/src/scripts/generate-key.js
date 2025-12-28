require('dotenv').config({ path: require('path').resolve(__dirname, '../../../../.env') });
const mongoose = require('mongoose');
const ApiKey = require('../models/apikey.model');

const generateKey = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log('Connected to MongoDB');

        const key = ApiKey.generate();
        const newKey = await ApiKey.create({
            key: key,
            owner: 'CLI Agent'
        });

        console.log('\nGenerated New API Key:');
        console.log('------------------------------------------------');
        console.log(newKey.key);
        console.log('------------------------------------------------');
        console.log('Use this key in your CLI: skyfetch config set apiKey <key>');

    } catch (error) {
        console.error('Error generating key:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

generateKey();
