const path = require('path');
const mongoose = require('mongoose');

// Handle Uncaught Exceptions (must be at top)
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!  Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') }); // Resolve from src/ to root
const app = require('./app');
const connectDB = require('./config/db');

const port = process.env.PORT || 3000;

// Connect to Database
connectDB();

const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!  Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Graceful Shutdown
const gracefulShutdown = () => {
    console.log('SIGTERM/SIGINT received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close(false, () => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
