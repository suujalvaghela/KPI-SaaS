import { iDeleteUser } from "./user.type.js";
import { AppError } from "../../utils/response.js";
import { prisma } from "../../lib/prisma.js";
import { deleteUserDto } from "./user.dao.js";

export const deleteUserService = async ({ authUser, id }: iDeleteUser) => {
    const adminRole = await prisma.role.findUnique({
        where: {
            id: authUser.id,
        }
    })
    if (authUser.id !== id && adminRole?.name !== 'ADMIN') {
        const error = new Error('Forbidden: You can only delete your own profile') as AppError;
        error.statusCode = 403;
        throw error;
    }
    await deleteUserDto(id);
}