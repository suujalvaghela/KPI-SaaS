import { Request, Response, NextFunction } from "express"
import { AppError, errorResponse } from "../utils/response.js"
import { prisma } from "../lib/prisma.js"

export const authorizationMiddlewear = (resource: string, action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user } = req;
            if (!user) {
                return errorResponse(res, 401, "Unauthorized");
            }
            const hasPermission = await prisma.policy.findFirst({
                where: {
                    role: user.role,
                    resource,
                    action
                }
            });
            if (!hasPermission) {
                const error = new Error(`You do not have permission to ${action} this ${resource}`) as AppError
                error.statusCode = 403
                return errorResponse(res, 403, error);
            }
            next();
        } catch (error) {
            return errorResponse(res, 500, error);
        }
    }
}