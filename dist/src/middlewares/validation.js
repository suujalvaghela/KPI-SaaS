import { ZodError } from "zod";
export const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req[source] || {});
            if (source === 'query' || source === 'params') {
                Object.assign(req[source], parsed);
            }
            else {
                req.body = parsed;
            }
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
