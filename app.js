const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const hpp = require('hpp');
const compression = require('compression');
const morgan = require('morgan');

const userRoutes = require('./routes/user_routes');
const adminRoutes = require('./routes/admin_routes');
const globalErrorHandler = require('./controller/error_controller');

const app = express();

app.use(helmet()); // Set Security HTTP Headers

if (process.env.NODE_ENV === 'development') {
    // Development logging
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    // Limit requests from same IP
    max: 100, // 100 requests
    windowMs: 60 * 60 * 1000, // per hour
    message: 'Too many requests from this IP, try again later!',
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' })); // Body parser → reading data from body into req.body
app.use(cors()); // Enable CORS
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression()); // Compress responses

// // Routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);

// Invalid Route
app.use((req, res) => {
    res.status(404).json({
        error: 'Page Not Found',
    });
});

app.use(globalErrorHandler);

module.exports = app;
