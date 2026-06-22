import { getMemberByIdsDao } from "../membership/membership.dao.js";
import { getMetricByIdDao } from "../metric/metric.dao.js";
import { createThresholdDao, getThresholdsByMetricDao, getThresholdByIdDao, updateThresholdDao, deleteThresholdDao } from "./threshold.dao.js";
import { getUserByEmailDao } from "../user/user.dao.js";
import { getWorkspaceByidDao } from "../workspace/workspace.dao.js";
import { workspaceCreator } from "../membership/membership.authorization.js";
export const createThresholdService = async ({ metric, condition, workspace, value, notifyUser, createdBy }) => {
    const metric_data = await getMetricByIdDao(metric);
    if (!metric_data) {
        const error = new Error('Metric not found');
        error.statusCode = 404;
        throw error;
    }
    if (metric_data.workspace !== workspace) {
        const error = new Error(`Metric ${metric} does not belong to this ${workspace} workspace`);
        error.statusCode = 404;
        throw error;
    }
    const user = await getUserByEmailDao(notifyUser);
    if (!user) {
        const error = new Error('Notify user not found');
        error.statusCode = 400;
        throw error;
    }
    const workspace_data = await getWorkspaceByidDao(workspace);
    if (!workspace_data) {
        const error = new Error('workspace not found');
        error.statusCode = 400;
        throw error;
    }
    return await createThresholdDao({ metric, condition, workspace, value, notifyUser, createdBy });
};
export const getThresholdsByMetricService = async ({ metric, user, cursor, limit }) => {
    const metric_data = await getMetricByIdDao(metric);
    if (!metric_data) {
        const error = new Error('Metric not found');
        error.statusCode = 404;
        throw error;
    }
    const member = await getMemberByIdsDao({ user, workspace: metric_data.workspace });
    if (!member) {
        const error = new Error('You are not a part of this workspace!');
        error.statusCode = 400;
        throw error;
    }
    return await getThresholdsByMetricDao({ metric, user, cursor, limit });
};
export const updateThresholdService = async ({ authUser, threshold, workspace, condition, value, notifyUser }) => {
    const threshold_data = await getThresholdByIdDao(threshold);
    if (threshold_data?.workspace !== workspace) {
        const error = new Error('Threshold is not valid!');
        error.statusCode = 400;
        throw error;
    }
    await workspaceCreator({ authUser, workspace });
    if (notifyUser) {
        const user = await getUserByEmailDao(notifyUser);
        if (!user) {
            const error = new Error('Notify user not found');
            error.statusCode = 400;
            throw error;
        }
    }
    await updateThresholdDao({ authUser, threshold, workspace, condition, value, notifyUser });
};
export const deleteThresholdService = async ({ authUser, threshold, workspace }) => {
    const threshold_data = await getThresholdByIdDao(threshold);
    if (threshold_data?.workspace !== workspace) {
        const error = new Error('Threshold is not valid!');
        error.statusCode = 400;
        throw error;
    }
    await workspaceCreator({ authUser: authUser, workspace });
    await deleteThresholdDao(threshold);
};
