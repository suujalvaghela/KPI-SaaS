import { iCreatePolicy } from "./policy.type.js";
import { AppError } from "../../utils/response.js";
import { prisma } from '../../lib/prisma.js';
import { createPolicyDao } from "./policy.dao.js";

export const createPolicyService = async ({ role, resource, action }: iCreatePolicy) => {
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