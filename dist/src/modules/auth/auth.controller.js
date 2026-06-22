import { successResponse } from "../../utils/response.js";
import { authenticateGoogleUser, getUserProfile, refreshSessionTokens } from "./auth.service.js";
import 'dotenv/config';
import { refreshTokenCookies, clearRefreshTokenCookie } from "../../utils/tokens.js";
export const handleGoogleAuth = async (req, res) => {
    const { iDaoken } = req.body;
    const { refreshToken, accessToken } = await authenticateGoogleUser(iDaoken);
    await refreshTokenCookies(res, refreshToken);
    return successResponse(res, 200, 'Authentication successful', { accessToken });
};
export const rotateTokens = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken ?? req.body?.refreshToken;
    if (!refreshToken) {
        const error = new Error('No refresh token provided');
        error.statusCode = 400;
        throw error;
    }
    const tokens = await refreshSessionTokens(refreshToken);
    refreshTokenCookies(res, tokens.refreshToken);
    return successResponse(res, 200, 'Tokens refreshed successfully', { accessToken: tokens.accessToken });
};
export const logoutUser = async (req, res) => {
    const { cookies: { refreshToken } } = req;
    if (!refreshToken) {
        const error = new Error('No refresh token provided');
        error.statusCode = 400;
        throw error;
    }
    await clearRefreshTokenCookie(res);
    return successResponse(res, 200, 'Logged out successfully');
};
export const getCurrentUser = async (req, res) => {
    const { headers: { authorization } } = req;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        const error = new Error("Invalid authorization header");
        error.statusCode = 401;
        throw error;
    }
    const token = authorization.split(' ')[1];
    const me = await getUserProfile(token);
    if (!me) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return successResponse(res, 200, 'User profile retrieved successfully', me);
};
