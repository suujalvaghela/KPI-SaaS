import jwt from "jsonwebtoken"
import "dotenv/config"
import { Response } from "express"
import { AppError } from "./response.js";

interface TokenPayload {
    id: string;
    role: string;
    email: string;
}

export const generateAccessToken = (payload: TokenPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '5d' })
}

export const generateRefreshToken = (payload: TokenPayload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' })
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
}

export const verifyRefreshToken = (refreshToken: string) => {
    if (!refreshToken) {
        const error = new Error('Refresh token is required') as AppError;
        error.statusCode = 400;
        throw error;
    }
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as TokenPayload
}

export const refreshTokenCookies = async (res: Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export const clearRefreshTokenCookie = async (res: Response) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    })
}