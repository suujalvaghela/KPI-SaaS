import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AppError, errorResponse, successResponse } from '../../utils/response.js';

export const createPolicy = async (req: Request, res: Response) => {
    const { role, resource, action } = req.body;

    if (!role || !resource || !action) {
        const error = new Error('Fill all the required fields') as AppError;
        error.statusCode = 400;
        throw error;
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

    const policy = await prisma.policy.create({
        data: {
            role,
            resource,
            action
        }
    })

    if (!policy) {
        return errorResponse(res, 500, 'Failed to create policy')
    }

    return successResponse(res, 201, 'Policy created successfully')
};