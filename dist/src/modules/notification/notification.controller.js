import { deleteNotificationDto, getNotificationDto, updateNotificationDto } from "./notification.dao.js";
import { successResponse } from "../../utils/response.js";
export const getNotification = async (req, res) => {
    const authUser = req.user;
    const cursor = req.query.cursor;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const notification = await getNotificationDto({ authUser: authUser.email, cursor, limit });
    return successResponse(res, 200, "Notification fetched successfully!", notification);
};
export const updateNotification = async (req, res) => {
    const authUser = req.user;
    const notification = req.params.id;
    const { isRead } = req.body;
    const result = await updateNotificationDto({ authUser: authUser.email, notification, isRead });
    if (result.count === 0) {
        const error = new Error("Notification not found");
        error.statusCode = 404;
        throw error;
    }
    return successResponse(res, 200, "Notification fetched successfully!", notification);
};
export const deleteNotification = async (req, res) => {
    const authUser = req.user;
    const notification = req.params.id;
    const result = await deleteNotificationDto(notification, authUser.email);
    if (result.count === 0) {
        const error = new Error("Notification not found");
        error.statusCode = 404;
        throw error;
    }
    return successResponse(res, 200, "Notification deleted successfully!");
};
