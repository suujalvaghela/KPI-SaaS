import { successResponse } from '../../utils/response.js';
import { createPolicyService } from './policy.service.js';
import { deletePolicyDao, getAllPoliciesDao, getPolicyByIdDao } from './policy.dao.js';
export const createPolicy = async (req, res) => {
    const { role, resource, action } = req.body;
    await createPolicyService({ role, resource, action });
    return successResponse(res, 201, 'Policy created successfully');
};
export const getAllPolicy = async (req, res) => {
    const cursor = req.query.cursor;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    await getAllPoliciesDao({ cursor, limit });
    return successResponse(res, 201, 'All policies fetched successfully');
};
export const getPolicyById = async (req, res) => {
    const policy = req.params.policyId;
    await getPolicyByIdDao(policy);
    return successResponse(res, 201, 'Policy fetched successfully');
};
export const deletePolicy = async (req, res) => {
    const policy = req.params.policyId;
    await deletePolicyDao(policy);
    return successResponse(res, 200, 'Policy deleted successfully');
};
