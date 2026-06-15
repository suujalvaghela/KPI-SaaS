import { prisma } from "../../lib/prisma.js";
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
    return prisma.user.findUnique({
        where: {
            id,
            deletedAt: null
        }
    });
};
export const getAllUsersDto = () => {
    return prisma.user.findMany({
        where: {
            deletedAt: null
        }
    });
};
export const deleteUserDto = (id) => {
    return prisma.user.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    });
};
