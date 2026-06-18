import { Request, Response } from "express"
import { successResponse, AppError } from "../../utils/response.js"
import { authenticateGoogleUser, getUserProfile, refreshSessionTokens } from "./auth.service.js";
import 'dotenv/config'
import { refreshTokenCookies, clearRefreshTokenCookie } from "../../utils/tokens.js";

export const handleGoogleAuth = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    const { refreshToken, accessToken } = await authenticateGoogleUser(idToken)
    await refreshTokenCookies(res, refreshToken)
    return successResponse(res, 200, 'Authentication successful', { accessToken })
}

export const rotateTokens = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken ?? req.body?.refreshToken
    if (!refreshToken) {
        const error = new Error('No refresh token provided') as AppError;
        error.statusCode = 400;
        throw error;
    }
    const tokens = await refreshSessionTokens(refreshToken)
    refreshTokenCookies(res, tokens.refreshToken);
    return successResponse(res, 200, 'Tokens refreshed successfully', { refreshToken: tokens.refreshToken });
}

export const logoutUser = async (req: Request, res: Response) => {
    const { cookies: { refreshToken } } = req;
    if (!refreshToken) {
        const error = new Error('No refresh token provided') as AppError;
        error.statusCode = 400;
        throw error;
    }
    await clearRefreshTokenCookie(res)
    return successResponse(res, 200, 'Logged out successfully')
}

export const getCurrentUser = async (req: Request, res: Response) => {
    const { headers: { authorization } } = req;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        const error = new Error("Invalid authorization header") as AppError;
        error.statusCode = 401;
        throw error;
    }
    const token = authorization.split(' ')[1]
    const me = await getUserProfile(token);
    if (!me) {
        const error = new Error("User not found") as AppError;
        error.statusCode = 404;
        throw error;
    }
    return successResponse(res, 200, 'User profile retrieved successfully', me);
} 
