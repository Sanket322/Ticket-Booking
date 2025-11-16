const { ZodError } = require('zod');
const formatZodError = require('../utils/zod_error_formatter');

const duplicateHandlor = (err, res) => {
    const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return res.status(400).json({
        status: 'fail',
        message,
    });
};

module.exports = (err, req, res, next) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            status: err.status,
            message: formatZodError(err),
        });
    }

    if (err.code === 11000) {
        return duplicateHandlor(err, res);
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error_stack: err.stack,
    });
};
