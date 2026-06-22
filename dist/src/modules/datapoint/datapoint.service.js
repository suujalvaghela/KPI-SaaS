import { getMemberByIdsDao } from "../membership/membership.dao.js";
import { getMetricByIdDao } from "../metric/metric.dao.js";
import { createDatapointDao, deleteDatapointDao, getDatapointByIdDao, getDatapointsByMetricDao } from "./datapoint.dao.js";
export const createDatapointService = async ({ authUser, metric, value, timestamp, workspace }) => {
    const metric_data = await getMetricByIdDao(metric);
    if (!metric_data) {
        const error = new Error('Metric not found');
        error.statusCode = 404;
        throw error;
    }
    if (metric_data.workspace !== workspace) {
        const error = new Error('Metric does not belong to this workspace!');
        error.statusCode = 404;
        throw error;
    }
    const member = await getMemberByIdsDao({ user: authUser, workspace: metric_data.workspace });
    if (!member) {
        const error = new Error('You are not a part of this workspace!');
        error.statusCode = 400;
        throw error;
    }
    timestamp = new Date(timestamp);
    return await createDatapointDao({ authUser, metric, value, timestamp, workspace });
};
export const getDatapointsByMetricService = async ({ metric, user, cursor, limit }) => {
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
    return await getDatapointsByMetricDao({ metric, user, cursor, limit });
};
export const deleteDatapointService = async ({ authUser, datapoint, workspace }) => {
    const datapoint_data = await getDatapointByIdDao(datapoint);
    if (!datapoint_data) {
        const error = new Error('Datapoint not found');
        error.statusCode = 404;
        throw error;
    }
    const metric_data = await getMetricByIdDao(datapoint_data.metric);
    if (!metric_data) {
        const error = new Error('Metric not found');
        error.statusCode = 404;
        throw error;
    }
    if (metric_data.workspace !== workspace) {
        const error = new Error('Datapoint is not valid for this workspace');
        error.statusCode = 400;
        throw error;
    }
    const member = await getMemberByIdsDao({ user: authUser, workspace: metric_data.workspace });
    if (!member) {
        const error = new Error('You are not a part of this workspace!');
        error.statusCode = 400;
        throw error;
    }
    return await deleteDatapointDao(datapoint);
};
