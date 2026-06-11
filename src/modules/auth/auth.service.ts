import 'dotenv/config'
import { AppError } from "../../utils/response.js";
import { GoogleUserDto } from './auth.dao.js';
import { OAuth2Client } from 'google-auth-library';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken } from '../../utils/tokens.js';
import { getUserByIdDto } from '../user/user.dao.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authenticateGoogleUser = async (idToken: string) => {
    const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()

    if (!payload || !payload.sub || !payload.email) {
        const error = new Error('Invalid Google token payload') as AppError;
        error.statusCode = 400;
        throw error;
    }

    const user = await GoogleUserDto({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || "",
        avatar: payload.picture || null
    })

    const tokenPayload = { id: user.id, role: user.role, email: user.email }

    const accessToken = generateAccessToken(tokenPayload)
    const refreshToken = generateRefreshToken(tokenPayload)

    return { refreshToken, accessToken };
}

export const refreshSessionTokens = async (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);
    const user = await getUserByIdDto(payload.id);

    if (!user) {
        const error = new Error('User not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    const tokenPayload = { id: user.id, role: user.role, email: user.email }

    const accessToken = generateAccessToken(tokenPayload)
    const newRefreshToken = generateRefreshToken(tokenPayload)

    return { accessToken, refreshToken: newRefreshToken }
}

export const getUserProfile = async (token: string) => {
    const payload = verifyAccessToken(token);
    if (!payload) {
        const error = new Error('Invalid access token') as AppError;
        error.statusCode = 401;
        throw error;
    }
    const me = await getUserByIdDto(payload.id)
    return me;
}