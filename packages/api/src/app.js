const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const healthRoutes = require('./routes/health');
const logsRoutes = require('./routes/logs');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middlewares/error');

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    exposedHeaders: ["x-api-key"],
}));
app.use(helmet());
// app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const logRoutes = require('./routes/logs');

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/hierarchy', projectRoutes);
app.use('/api/logs', logRoutes);
app.use('/auth', authRoutes);

// Handle Unhandled Routes
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
