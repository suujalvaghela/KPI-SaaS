import { AppError } from "../../utils/response.js"
import { getMemberByIdsDto } from "../membership/membership.dao.js"
import { getMetricByIdDto } from "../metric/metric.dao.js"
import { createDatapointDao, getDatapointsByMetricDao } from "./datapoint.dao.js"
import { iCreateDatapoint, iGetDatapoints } from "./datapoint.type.js"

export const createDatapointService = async ({ authUser, metric, value, timestamp }: iCreateDatapoint) => {
    const metric_data = await getMetricByIdDto(metric)

    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
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
    return await createDatapointDao({ authUser, metric, value, timestamp })
}

export const getDatapointsByMetricService = async ({ metric, user }: iGetDatapoints) => {
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

    return await getDatapointsByMetricDao(metric)
}
