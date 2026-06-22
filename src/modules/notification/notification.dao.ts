import { prisma } from "../../lib/prisma.js"
import { cursorPagination } from "../../utils/pagination.js"
import { iCreateNotification, iGetNotification, iUpdateNotification } from "./notification.type.js"

export const createNotificationDao = async ({ user, workspace, message }: iCreateNotification) => {
    return prisma.notification.create({
        data: {
            user,
            workspace,
            message
        }
    })
}

export const getNotificationDao = async ({ authUser, cursor, limit }: iGetNotification) => {
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
    })
    return cursorPagination(notifications, limit)
}

export const updateNotificationDao = async ({ authUser, notification, isRead }: iUpdateNotification) => {
    return prisma.notification.updateMany({
        where: { id: notification, user: authUser },
        data: { isRead }
    })
}

export const deleteNotificationDao = async (id: string, authUser: string) => {
    return prisma.notification.deleteMany({
        where: {
            id,
            user: authUser
        }
    })
}
