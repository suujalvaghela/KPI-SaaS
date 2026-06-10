import 'dotenv/config'
import { AppError } from "../../utils/response.js";
import { GoogleUserDto } from './auth.dao.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken'

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
        name: payload.name || 'Google User',
        avatar: payload.picture || null
    })

    const tokenPayload = { id: user.id, role: user.role, email: user.email }

    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET as string, { expiresIn: '15m' })
    const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' })

    return { user, refreshToken, accessToken }
}

export const refreshSessionTokens = () => { }
export const clearUserSession = (refreshToken: string) => { }
export const getUserProfile = () => { }