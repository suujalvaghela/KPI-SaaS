export const errorResponse = (res, statusCode, error) => {
    if (error instanceof Error) {
        return res.status(statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal server error!' });
};
export const successResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({ message, ...(data != undefined && { data }) });
};
