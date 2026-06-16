import { AppError } from "../../utils/response.js"
import { workspaceCreator } from "../membership/membership.authorization.js"
import { getMemberByIdsDto } from "../membership/membership.dao.js"
import { iGetMember } from "../membership/membership.type.js"
import { createMetricDto, getMetricByIdDto, getMetricsByWorkspaceDto, updateMetricDto, deleteMetricDto } from "./metric.dao.js"
import { iCreateMetric, iDeleteMetric, iUpdateMetric } from "./metric.type.js"

export const createMetricService = async ({ workspace, name, description, unit, creator }: iCreateMetric) => {
    return await createMetricDto({ workspace, name, description, unit, creator })
}

export const getMetricsByWorkspaceService = async ({ user, workspace }: iGetMember) => {
    const member = await getMemberByIdsDto({ user, workspace })
    if (!member) {
        const error = new Error('You are not a part of this workspace!') as AppError;
        error.statusCode = 400;
        throw error;
    }
    return await getMetricsByWorkspaceDto(workspace)
}

export const updateMetricService = async (authUser: string, { metric, name, description, unit }: iUpdateMetric) => {
    const metric_data = await getMetricByIdDto(metric)

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
        await updateMetricDto({ metric, name, description, unit })
    }
}

export const deleteMetricService = async ({ authUser, metric }: iDeleteMetric) => {
    const metric_data = await getMetricByIdDto(metric)

    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
        error.statusCode = 404;
        throw error;
    }
    else if (metric_data.creator === authUser) {
        await deleteMetricDto(metric)
    }
    else {
        await workspaceCreator({ authUser, workspace: metric_data.workspace })
        await deleteMetricDto(metric)
    }
}
