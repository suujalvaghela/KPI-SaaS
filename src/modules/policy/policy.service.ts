import { iCreatePolicy } from "./policy.type.js";
import { AppError } from "../../utils/response.js";
import { prisma } from '../../lib/prisma.js';
import { createPolicyDao } from "./policy.dao.js";
import { AuthenticatedUser } from "../../utils/authUser.js";

export const createPolicyService = async (authUser: AuthenticatedUser, { role, resource, action }: iCreatePolicy) => {
    const userRole = await prisma.role.findUnique({
        where: {
            id: authUser.role
        }
    })
    if (userRole?.name !== 'ADMIN') {
        const error = new Error('You can not access this route!') as AppError
        error.statusCode = 400;
        return error;
     }

    const roleData = prisma.role.findUnique({
        where: {
            id: role
        }
    })

    if (!roleData) {
        const error = new Error('Provided Role is not valid') as AppError
        error.statusCode = 404;
        return error;
    }

    await createPolicyDao({ role, resource, action })
}