import { prisma } from "../../lib/prisma.js";
import { cursorPagination } from "../../utils/pagination.js";
export const createNotificationDto = async ({ user, workspace, message }) => {
    return prisma.notification.create({
        data: {
            user,
            workspace,
            message
        }
    });
};
export const getNotificationDto = async ({ authUser, cursor, limit }) => {
    const notifications = await prisma.notification.findMany({
        where: { user: authUser },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && {
            cursor: {
                id: cursor
            }
        })
    });
    return cursorPagination(notifications, limit);
};
export const updateNotificationDto = async ({ authUser, notification, isRead }) => {
    return prisma.notification.updateMany({
        where: { id: notification, user: authUser },
        data: { isRead }
    });
};
export const deleteNotificationDto = async (id, authUser) => {
    return prisma.notification.deleteMany({
        where: {
            id,
            user: authUser
        }
    });
};
