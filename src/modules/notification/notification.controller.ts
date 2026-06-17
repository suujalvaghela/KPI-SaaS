import { Request, Response } from "express"
import { deleteNotificationDto, getNotificationDto, updateNotificationDto } from "./notification.dao.js"
import { successResponse } from "../../utils/response.js"

export const getNotification = async (req: Request, res: Response) => {
    const authUser = req.user!
    const cursor = req.query.cursor as string | undefined
    const limit = req.query.limit ? Number(req.query.limit) : 5
    const notification = await getNotificationDto({ authUser: authUser.email, cursor, limit })
    return successResponse(res, 200, "Notification fetched successfully!", notification)
}

export const updateNotification = async (req: Request, res: Response) => {
    const authUser = req.user!
    const notification = req.params.id as string
    const { isRead } = req.body
    await updateNotificationDto({ authUser: authUser.email, notification, isRead })
    return successResponse(res, 200, "Notification fetched successfully!", notification)
}

export const deleteNotification = async (req: Request, res: Response) => {
    const authUser = req.user!
    const notification = req.params.id as string
    await deleteNotificationDto(notification, authUser.email)
    return successResponse(res, 200, "Notification deleted successfully!")
}
