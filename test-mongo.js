const mongoose = require('mongoose');

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect('mongodb+srv://rajneeshojha0:Rajneesh23@cluster0.okal0.mongodb.net/?appName=Cluster0/skyfetch', { serverSelectionTimeoutMS: 5000 });
        console.log('Success: MongoDB is running and reachable.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Failure: Could not connect to MongoDB.');
        console.error('Error details:', error.message);
    }
};

testConnection();
