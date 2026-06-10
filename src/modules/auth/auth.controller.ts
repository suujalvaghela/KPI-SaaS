import { Request, Response } from "express"
import { successResponse, AppError } from "../../utils/response.js"
import { authenticateGoogleUser } from "./auth.service.js";
import 'dotenv/config'

export const handleGoogleAuth = async (req: Request, res: Response) => {
    const { idToken } = req.body;

    if (!idToken || typeof idToken !== 'string') {
        const error = new Error('Missing or invalid idToken') as AppError;
        error.statusCode = 400;
        throw error;
    }

    const { user, refreshToken, accessToken } = await authenticateGoogleUser(idToken)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
    return successResponse(res, 200, 'Authentication successful', { user, accessToken })
}
export const rotateTokens = async (req: Request, res: Response) => {
    
}
export const logoutUser = async (req: Request, res: Response) => { }
export const getCurrentUser = async (req: Request, res: Response) => { }