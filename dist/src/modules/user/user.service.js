import { prisma } from "../../lib/prisma.js";
import { deleteUserDao } from "./user.dao.js";
export const deleteUserService = async ({ authUser, id }) => {
    const adminRole = await prisma.role.findUnique({
        where: {
            id: authUser.role,
        }
    });
    if (authUser.id !== id && adminRole?.name !== 'ADMIN') {
        const error = new Error('Forbidden: You can only delete your own profile');
        error.statusCode = 403;
        throw error;
    }
    await deleteUserDao(id);
};
