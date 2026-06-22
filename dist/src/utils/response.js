const getErrorMessage = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    if (error && typeof error === "object") {
        const maybeError = error;
        if (typeof maybeError.message === "string") {
            return maybeError.message;
        }
        if (typeof maybeError.error?.description === "string") {
            return maybeError.error.description;
        }
        if (typeof maybeError.error?.reason === "string") {
            return maybeError.error.reason;
        }
    }
};
export const errorResponse = (res, statusCode, error) => {
    return res.status(statusCode).json({ message: getErrorMessage(error) ?? 'Internal server error!' });
};
export const successResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).json({ message, ...(data != undefined && { data }) });
};
