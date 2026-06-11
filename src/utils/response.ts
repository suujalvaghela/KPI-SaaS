import { Response } from "express"

export type AppError = Error & { statusCode?: number }

export const errorResponse = (
    res: Response,
    statusCode: number,
    error: unknown
) => {
    if (error instanceof Error) {
        return res.status(statusCode).json({ message: error.message })
    }
    return res.status(500).json({ message: 'Internal server error!' })
}

export const successResponse = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
) => {
    return res.status(statusCode).json({ message, ...(data != undefined && { data }) })
} 