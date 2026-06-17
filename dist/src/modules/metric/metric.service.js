import { workspaceCreator } from "../membership/membership.authorization.js";
import { getMemberByIdsDto } from "../membership/membership.dao.js";
import { createMetricDto, getMetricByIdDto, getMetricsByWorkspaceDto, updateMetricDto, deleteMetricDto } from "./metric.dao.js";
export const createMetricService = async ({ workspace, name, description, unit, creator }) => {
    return await createMetricDto({ workspace, name, description, unit, creator });
};
export const getMetricsByWorkspaceService = async ({ user, workspace, cursor, limit }) => {
    const member = await getMemberByIdsDto({ user, workspace });
    if (!member) {
        const error = new Error('You are not a part of this workspace!');
        error.statusCode = 400;
        throw error;
    }
    return await getMetricsByWorkspaceDto({ user, workspace, cursor, limit });
};
export const updateMetricService = async (authUser, { metric, name, description, unit }) => {
    const metric_data = await getMetricByIdDto(metric);
    if (!metric_data) {
        const error = new Error('Metric not found');
        error.statusCode = 404;
        throw error;
    }
    else if (metric_data.creator !== authUser) {
        const error = new Error('You can only update yours!');
        error.statusCode = 400;
        throw error;
    }
    else {
        await updateMetricDto({ metric, name, description, unit });
    }
};
export const deleteMetricService = async ({ authUser, metric }) => {
    const metric_data = await getMetricByIdDto(metric);
    if (!metric_data) {
        const error = new Error('Metric not found');
        error.statusCode = 404;
        throw error;
    }
    else if (metric_data.creator === authUser) {
        await deleteMetricDto(metric);
    }
    else {
        await workspaceCreator({ authUser, workspace: metric_data.workspace });
        await deleteMetricDto(metric);
    }
};
