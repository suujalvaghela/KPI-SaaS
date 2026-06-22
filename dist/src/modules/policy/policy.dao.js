import { prisma } from '../../lib/prisma.js';
export const createPolicyDao = async ({ role, resource, action }) => {
    return await prisma.policy.create({
        data: {
            role,
            resource,
            action
        }
    });
};
export const getAllPoliciesDao = async ({ cursor, limit }) => {
    return await prisma.policy.findMany({
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && {
            cursor: {
                id: cursor
            }
        })
    });
};
export const getPolicyByIdDao = async (policy) => {
    return await prisma.policy.findUnique({
        where: {
            id: policy
        }
    });
};
export const deletePolicyDao = async (policy) => {
    return await prisma.policy.delete({
        where: { id: policy }
    });
};
