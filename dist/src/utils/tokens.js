import jwt from "jsonwebtoken";
import "dotenv/config";
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
export const verifyRefreshToken = (refreshToken) => {
    if (!refreshToken) {
        const error = new Error('Refresh token is required');
        error.statusCode = 400;
        throw error;
    }
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
};
export const refreshTokenCookies = async (res, refreshToken) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};
export const clearRefreshTokenCookie = async (res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
};
