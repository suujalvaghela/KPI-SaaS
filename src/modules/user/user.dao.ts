import { prisma } from "../../lib/prisma.js"
import { cursorPagination } from "../../utils/pagination.js"
import { iGetAllUsers, iUpdateUser } from "./user.type.js"

export const updateUserDto = ({ id, name }: iUpdateUser) => {
    return prisma.user.update({
        where: {
            id,
            deletedAt: null
        },
        data: { name }
    })
}

export const getUserByIdDto = (id: string) => {
    return prisma.user.findFirst({
        where: {
            id,
            deletedAt: null
        }
    })
}
export const getUserByEmailDto = (email: string) => {
    return prisma.user.findFirst({
        where: {
            email,
            deletedAt: null
        }
    })
}

export const getAllUsersDto = async ({ cursor, limit }: iGetAllUsers) => {
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

export const deleteUserDto = (id: string) => {
    return prisma.user.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })
}