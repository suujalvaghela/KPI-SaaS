import { prisma } from '../../lib/prisma.js';
import { errorResponse, successResponse } from '../../utils/response.js';
export const createPolicy = async (req, res) => {
    const { role, resource, action } = req.body;
    if (!role || !resource || !action) {
        const error = new Error('Fill all the required fields');
        error.statusCode = 400;
        throw error;
    }
    const roleData = prisma.role.findUnique({
        where: {
            id: role
        }
    });
    if (!roleData) {
        const error = new Error('Provided Role is not valid');
        error.statusCode = 404;
        return error;
    }
    const policy = await prisma.policy.create({
        data: {
            role,
            resource,
            action
        }
    });
    if (!policy) {
        return errorResponse(res, 500, 'Failed to create policy');
    }
    return successResponse(res, 201, 'Policy created successfully');
};
