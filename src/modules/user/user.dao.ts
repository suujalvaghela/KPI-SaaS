import { prisma } from "../../lib/prisma.js"
import { cursorPagination } from "../../utils/pagination.js"
import { iGetAllUsers, iUpdateUser } from "./user.type.js"

export const updateUserDao = ({ id, name }: iUpdateUser) => {
    return prisma.user.update({
        where: {
            id,
            deletedAt: null
        },
        data: { name }
    })
}

export const getUserByIdDao = (id: string) => {
    return prisma.user.findFirst({
        where: {
            id,
            deletedAt: null
        }
    })
}
export const getUserByEmailDao = (email: string) => {
    return prisma.user.findFirst({
        where: {
            email,
            deletedAt: null
        }
    })
}

export const getAllUsersDao = async ({ cursor, limit }: iGetAllUsers) => {
    const users = await prisma.user.findMany({
        where: {
            deletedAt: null
        },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && {
            cursor: {
                id: cursor
            }
        })
    })
    return cursorPagination(users, limit)
}

export const deleteUserDao = (id: string) => {
    return prisma.user.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })
}