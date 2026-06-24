import { Request, Response } from 'express';
import { successResponse } from '../../utils/response.js';
import { createPolicyService } from './policy.service.js';
import { deletePolicyDao, getAllPoliciesDao, getPolicyByIdDao } from './policy.dao.js';

export const createPolicy = async (req: Request, res: Response) => {
    const { role, resource, action } = req.body;
    const authUser = req.user!
    await createPolicyService(authUser, { role, resource, action })
    return successResponse(res, 201, 'Policy created successfully')
};

export const getAllPolicy = async (req: Request, res: Response) => {
    const cursor = req.query.cursor as string | undefined
    const limit = req.query.limit ? Number(req.query.limit) : 5
    await getAllPoliciesDao({ cursor, limit })
    return successResponse(res, 201, 'All policies fetched successfully')
}

export const getPolicyById = async (req: Request, res: Response) => {
    const policy = req.params.policyId as string
    await getPolicyByIdDao(policy)
    return successResponse(res, 201, 'Policy fetched successfully')
}

export const deletePolicy = async (req: Request, res: Response) => {
    const policy = req.params.policyId as string
    await deletePolicyDao(policy)
    return successResponse(res, 200, 'Policy deleted successfully')
}