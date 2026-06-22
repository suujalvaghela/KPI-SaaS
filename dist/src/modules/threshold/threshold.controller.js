import { successResponse } from "../../utils/response.js";
import { createThresholdService, deleteThresholdService, getThresholdsByMetricService, updateThresholdService } from "./threshold.service.js";
import { workspaceCreator } from "../membership/membership.authorization.js";
export const createThreshold = async (req, res) => {
    const metric = req.params.metricId;
    const workspace = req.params.workspaceId;
    const { condition, value, notifyUser } = req.body;
    const authUser = req.user;
    await workspaceCreator({ authUser: authUser.id, workspace });
    await createThresholdService({ metric, condition, workspace, value, notifyUser, createdBy: authUser.id });
    return successResponse(res, 201, 'Threshold created successfully');
};
export const getThresholdsByMetric = async (req, res) => {
    const metric = req.params.metricId;
    const authUser = req.user;
    const cursor = req.query.cursor;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const thresholds = await getThresholdsByMetricService({ metric, user: authUser.id, cursor, limit });
    return successResponse(res, 200, 'Thresholds fetched successfully', thresholds);
};
export const updateThreshold = async (req, res) => {
    const threshold = req.params.thresholdId;
    const workspace = req.params.workspaceId;
    const { condition, value, notifyUser } = req.body;
    const authUser = req.user;
    await updateThresholdService({ authUser: authUser.id, threshold, workspace, condition, value, notifyUser });
    return successResponse(res, 200, 'Threshold updated successfully');
};
export const deleteThreshold = async (req, res) => {
    const threshold = req.params.thresholdId;
    const workspace = req.params.workspaceId;
    const authUser = req.user;
    await deleteThresholdService({ authUser: authUser.id, threshold, workspace });
    return successResponse(res, 200, 'Threshold deleted successfully');
};
