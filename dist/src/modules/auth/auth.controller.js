import { successResponse } from "../../utils/response.js";
import { authenticateGoogleUser, getUserProfile, refreshSessionTokens } from "./auth.service.js";
import 'dotenv/config';
import { clearRefreshTokenCookie } from "../../utils/tokens.js";
export const handleGoogleAuth = async (req, res) => {
    const { idToken } = req.body;
    if (!idToken || typeof idToken !== 'string') {
        const error = new Error('Missing or invalid id_token');
        error.statusCode = 400;
        throw error;
    }
    const { refreshToken, accessToken } = await authenticateGoogleUser(idToken);
    // refreshTokenCookies(res, refreshToken)
    return successResponse(res, 200, 'Authentication successful', { accessToken, refreshToken });
};
export const rotateTokens = async (req, res) => {
    const { refreshToken } = req.body || req.cookies;
    if (!refreshToken) {
        const error = new Error('No refresh token provided');
        error.statusCode = 400;
        throw error;
    }
    const tokens = await refreshSessionTokens(refreshToken);
    // refreshTokenCookies(res, tokens.refreshToken)
    return successResponse(res, 200, 'Tokens refreshed successfully', { refreshToken: refreshToken, accessToken: tokens.accessToken });
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
