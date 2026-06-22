import { Response } from "express"

export type AppError = Error & { statusCode?: number }

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
        return error.message
    }

    if (error && typeof error === "object") {
        const maybeError = error as {
            message?: unknown,
            error?: { description?: unknown, reason?: unknown }
        }

        if (typeof maybeError.message === "string") {
            return maybeError.message
        }

        if (typeof maybeError.error?.description === "string") {
            return maybeError.error.description
        }

        if (typeof maybeError.error?.reason === "string") {
            return maybeError.error.reason
        }
    }
}

export const errorResponse = (
    res: Response,
    statusCode: number,
    error: unknown
) => {
    return res.status(statusCode).json({ message: getErrorMessage(error) ?? 'Internal server error!' })
}

export const successResponse = <T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
) => {
    return res.status(statusCode).json({ message, ...(data != undefined && { data }) })
} 
