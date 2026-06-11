import { Request, Response, NextFunction } from "express"
import { errorResponse } from "../utils/response.js"
import { prisma } from "../lib/prisma.js"

export const authorizationMiddlewear = (resource: string, action: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
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
                return errorResponse(res, 403, `You do not have permission to ${action} this ${resource}`);
            }
            next();
        } catch (error) {
            return errorResponse(res, 500, error);
        }
    }
}