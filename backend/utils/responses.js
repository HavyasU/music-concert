export const sendSuccessResponse = (res, status = 200, message = "", data = {}) => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};


export const sendErrorResponse = (res, status = 500, message = "", errors = null,) => {
    return res.status(status).json({
        success: false,
        message,
        errors
    });
};