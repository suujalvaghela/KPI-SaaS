import { deleteNotificationDao, getNotificationDao, updateNotificationDao } from "./notification.dao.js";
import { successResponse } from "../../utils/response.js";
export const getNotification = async (req, res) => {
    const authUser = req.user;
    const cursor = req.query.cursor;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const notification = await getNotificationDao({ authUser: authUser.email, cursor, limit });
    return successResponse(res, 200, "Notification fetched successfully!", notification);
};
export const updateNotification = async (req, res) => {
    const authUser = req.user;
    const notification = req.params.id;
    const { isRead } = req.body;
    await updateNotificationDao({ authUser: authUser.email, notification, isRead });
    return successResponse(res, 200, "Notification fetched successfully!", notification);
};
export const deleteNotification = async (req, res) => {
    const authUser = req.user;
    const notification = req.params.id;
    await deleteNotificationDao(notification, authUser.email);
    return successResponse(res, 200, "Notification deleted successfully!");
};
