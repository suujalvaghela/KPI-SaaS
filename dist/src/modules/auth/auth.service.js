import 'dotenv/config';
import { googleUserDao } from './auth.dao.js';
import { OAuth2Client } from 'google-auth-library';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from '../../utils/tokens.js';
import { getUserByIdDao } from '../user/user.dao.js';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const authenticateGoogleUser = async (idToken) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
        const error = new Error('Invalid Google token payload');
        error.statusCode = 400;
        throw error;
    }
    const user = await googleUserDao({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || "",
        avatar: payload.picture || null
    });
    const tokenPayload = { id: user.id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    return { refreshToken, accessToken };
};
export const refreshSessionTokens = async (refreshToken) => {
    const payload = verifyRefreshToken(refreshToken);
    const user = await getUserByIdDao(payload.id);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    const tokenPayload = { id: user.id, role: user.role, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);
    return { accessToken, refreshToken: newRefreshToken };
};
export const getUserProfile = async (token) => {
    const payload = verifyAccessToken(token);
    if (!payload) {
        const error = new Error('Invalid access token');
        error.statusCode = 401;
        throw error;
    }
    const me = await getUserByIdDao(payload.id);
    return me;
};
