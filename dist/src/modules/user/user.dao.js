import { prisma } from "../../lib/prisma.js";
import { cursorPagination } from "../../utils/pagination.js";
export const updateUserDto = ({ id, name }) => {
    return prisma.user.update({
        where: {
            id,
            deletedAt: null
        },
        data: { name }
    });
};
export const getUserByIdDto = (id) => {
    return prisma.user.findFirst({
        where: {
            id,
            deletedAt: null
        }
    });
};
export const getUserByEmailDto = (email) => {
    return prisma.user.findFirst({
        where: {
            email,
            deletedAt: null
        }
    });
};
export const getAllUsersDto = async ({ cursor, limit }) => {
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
    });
    return cursorPagination(users, limit);
};
export const deleteUserDto = (id) => {
    return prisma.user.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    });
};
