import { Request, Response, NextFunction } from "express";
import { ZodError, ZodType } from "zod";

export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body || {})
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