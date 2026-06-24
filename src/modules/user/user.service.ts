import { iDeleteUser, iUpdateUser } from "./user.type.js";
import { AppError } from "../../utils/response.js";
import { prisma } from "../../lib/prisma.js";
import { updateUserDao, deleteUserDao } from "./user.dao.js";
import { AuthenticatedUser } from "../../utils/authUser.js";

export const updateUserService = async (authUser: AuthenticatedUser, { id, name, role }: iUpdateUser) => {
    const adminRole = await prisma.role.findUnique({
        where: { id: authUser.role, }
    })
    const isAdmin = adminRole?.name === 'ADMIN';

    if (authUser.id !== id && !isAdmin) {
        const error = new Error('Forbidden: You can update only your own profile') as AppError;
        error.statusCode = 403;
        throw error;
    }
    await updateUserDao({
        id,
        name,
        role
        // ...(isAdmin && role && { role })
    });
}


export const deleteUserService = async ({ authUser, id }: iDeleteUser) => {
    const adminRole = await prisma.role.findUnique({
        where: {
            id: authUser.role,
        }
    })
    if (authUser.id !== id && adminRole?.name !== 'ADMIN') {
        const error = new Error('Forbidden: You can delete only your own profile') as AppError;
        error.statusCode = 403;
        throw error;
    }
    await deleteUserDao(id);
}