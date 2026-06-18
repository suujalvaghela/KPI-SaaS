import { AppError } from "../../utils/response.js"
import { getMemberByIdsDto } from "../membership/membership.dao.js"
import { getMetricByIdDto } from "../metric/metric.dao.js"
import { createDatapointDao, deleteDatapointDto, getDatapointByIdDao, getDatapointsByMetricDao } from "./datapoint.dao.js"
import { iCreateDatapoint, iDeleteDatapoint, iGetDatapoints } from "./datapoint.type.js"

export const createDatapointService = async ({ authUser, metric, value, timestamp, workspace }: iCreateDatapoint) => {
    const metric_data = await getMetricByIdDto(metric)

    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    if (metric_data.workspace !== workspace) {
        const error = new Error('Metric does not belong to this workspace!') as AppError;
        error.statusCode = 404;
        throw error;
    }

    const member = await getMemberByIdsDto({ user: authUser, workspace: metric_data.workspace })
    if (!member) {
        const error = new Error('You are not a part of this workspace!') as AppError;
        error.statusCode = 400;
        throw error;
    }

    timestamp = new Date(timestamp);
    return await createDatapointDao({ authUser, metric, value, timestamp,workspace })
}

export const getDatapointsByMetricService = async ({ metric, user, cursor, limit }: iGetDatapoints) => {
    const metric_data = await getMetricByIdDto(metric)

    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    const member = await getMemberByIdsDto({ user, workspace: metric_data.workspace })
    if (!member) {
        const error = new Error('You are not a part of this workspace!') as AppError;
        error.statusCode = 400;
        throw error;
    }

    return await getDatapointsByMetricDao({ metric, user, cursor, limit })
}

export const deleteDatapointService = async ({ authUser, datapoint, workspace }: iDeleteDatapoint) => {
    const datapoint_data = await getDatapointByIdDao(datapoint)
    if (!datapoint_data) {
        const error = new Error('Datapoint not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    const metric_data = await getMetricByIdDto(datapoint_data.metric)
    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    if (metric_data.workspace !== workspace) {
        const error = new Error('Datapoint is not valid for this workspace') as AppError;
        error.statusCode = 400;
        throw error;
    }

    const member = await getMemberByIdsDto({ user: authUser, workspace: metric_data.workspace })
    if (!member) {
        const error = new Error('You are not a part of this workspace!') as AppError;
        error.statusCode = 400;
        throw error;
    }

    return await deleteDatapointDto(datapoint)
}
