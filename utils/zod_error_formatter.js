const formatZodError = (zodError) => {
    const formatted = {};

    zodError.issues.forEach((err) => {
        const field = err.path.join('.');
        formatted[field] = err.message;
    });

    return formatted;
};

module.exports = formatZodError;
