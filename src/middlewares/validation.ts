import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export const validate = (schema: ZodType, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req[source] || {})
            if (source === 'query' || source === 'params') {
                Object.assign(req[source], parsed);
            }
            else {
                req.body = parsed;
            }
            next()
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    message: error.issues[0].message,
                    errors: error.issues
                });
            }
            next(error)
        }
    }
}