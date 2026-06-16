import { prisma } from "../../lib/prisma.js"
import { iUpdateUser } from "./user.type.js"

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
    return prisma.user.findUnique({
        where: {
            id,
            deletedAt: null
        }
    })
}
export const getUserByEmailDto = (email: string) => {
    return prisma.user.findUnique({
        where: {
            email,
            deletedAt: null
        }
    })
}

export const getAllUsersDto = () => {
    return prisma.user.findMany({
        where: {
            deletedAt: null
        }
    })
}

export const deleteUserDto = (id: string) => {
    return prisma.user.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })
}