export const sendSuccessResponse = (res, status = 200, message = "", data = {}) => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};


export const sendErrorResponse = (res, errors = null, message = "", status = 500) => {
    return res.status(status).json({
        success: false,
        message,
        errors
    });
};