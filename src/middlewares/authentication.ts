import { Request, Response, NextFunction } from "express"
import { errorResponse } from "../utils/response.js"
import 'dotenv/config'
import jwt from "jsonwebtoken"

export const authenticationMiddlewear = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { headers: { authorization } } = req;
        if (!authorization) {
            return errorResponse(res, 401, "Unauthorized");
        }
        const token = authorization?.split(' ')[1];
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET as string) as Request["user"];
        req.user = decodedUser;
        next();
    } catch (error) {
        return errorResponse(res, 401, error)
    }
}
