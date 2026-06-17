import { ZodError } from "zod";
export const validate = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body || {});
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                    errors: error.issues
                });
            }
            next(error);
        }
    };
};
