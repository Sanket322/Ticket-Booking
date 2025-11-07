const { ZodError } = require("zod");
const formatZodError = require("../utils/zod_error_formatter");

module.exports = (err, req, res, next) => {
    if(err instanceof ZodError) {
        return res.status(400).json({
            status : err.status,
            message : formatZodError(err)
        })
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error"
    res.status(err.statusCode).json({
        status : err.status,
        message : err.message
    })
}