import { AppError } from "../../utils/response.js"
import { workspaceCreator } from "../membership/membership.authorization.js"
import { getMemberByIdsDao } from "../membership/membership.dao.js"
import { createMetricDao, getMetricByIdDao, getMetricsByWorkspaceDao, updateMetricDao, deleteMetricDao } from "./metric.dao.js"
import { iCreateMetric, iDeleteMetric, iGetMetric, iUpdateMetric } from "./metric.type.js"

export const createMetricService = async ({ workspace, name, description, unit, creator }: iCreateMetric) => {
    return await createMetricDao({ workspace, name, description, unit, creator })
}

export const getMetricsByWorkspaceService = async ({ user, workspace, cursor, limit }: iGetMetric) => {
    const member = await getMemberByIdsDao({ user, workspace })
    if (!member) {
        const error = new Error('You are not a part of this workspace!') as AppError;
        error.statusCode = 400;
        throw error;
    }
    return await getMetricsByWorkspaceDao({ user, workspace, cursor, limit })
}

export const updateMetricService = async (authUser: string, { metric, name, description, unit }: iUpdateMetric) => {
    const metric_data = await getMetricByIdDao(metric)

    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
        error.statusCode = 404;
        throw error;
    }
    else if (metric_data.creator !== authUser) {
        const error = new Error('You can only update yours!') as AppError;
        error.statusCode = 400;
        throw error;
    }
    else {
        await updateMetricDao({ metric, name, description, unit })
    }
}

export const deleteMetricService = async ({ authUser, metric }: iDeleteMetric) => {
    const metric_data = await getMetricByIdDao(metric)

    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
        error.statusCode = 404;
        throw error;
    }
    else if (metric_data.creator === authUser) {
        await deleteMetricDao(metric)
    }
    else {
        await workspaceCreator({ authUser, workspace: metric_data.workspace })
        await deleteMetricDao(metric)
    }
}
