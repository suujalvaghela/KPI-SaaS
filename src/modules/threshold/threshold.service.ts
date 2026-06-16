import { AppError } from "../../utils/response.js"
import { getMemberByIdsDto } from "../membership/membership.dao.js"
import { getMetricByIdDto } from "../metric/metric.dao.js"
import { createThresholdDao, getThresholdsByMetricDao, updateThresholdDto } from "./threshold.dao.js"
import { iCreateThreshold, iGetThresholds, iUpdateThreshold } from "./threshold.type.js"
import { getUserByEmailDto } from "../user/user.dao.js"
import { getWorkspaceByidDto } from "../workspace/workspace.dao.js"

export const createThresholdService = async ({ metric, condition, workspace, value, notifyUser, createdBy }: iCreateThreshold) => {
    const metric_data = await getMetricByIdDto(metric)
    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    const user = await getUserByEmailDto(notifyUser)
    if (!user) {
        const error = new Error('Notify user not found') as AppError;
        error.statusCode = 400;
        throw error;
    }

    const workspace_data = await getWorkspaceByidDto(workspace)
    if (!workspace_data) {
        const error = new Error('workspace not found') as AppError;
        error.statusCode = 400;
        throw error;
    }

    return await createThresholdDao({ metric, condition, workspace, value, notifyUser, createdBy })
}

export const getThresholdsByMetricService = async ({ metric, user }: iGetThresholds) => {
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

    return await getThresholdsByMetricDao(metric)
}

export const updateThresholdService = async ({ threshold, condition, value, notifyUser }: iUpdateThreshold) => {
    if (notifyUser) {
        const user = await getUserByEmailDto(notifyUser)
        if (!user) {
            const error = new Error('Notify user not found') as AppError;
            error.statusCode = 400;
            throw error;
        }
    }

    await updateThresholdDto({ threshold, condition, value, notifyUser })
}

