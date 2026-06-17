import { AppError } from "../../utils/response.js"
import { getMemberByIdsDto } from "../membership/membership.dao.js"
import { getMetricByIdDto } from "../metric/metric.dao.js"
import { createThresholdDao, getThresholdsByMetricDao, getThresholdByIdDao, updateThresholdDto, deleteThresholdDto } from "./threshold.dao.js"
import { iCreateThreshold, iDeleteThreshold, iGetThresholds, iUpdateThreshold } from "./threshold.type.js"
import { getUserByEmailDto } from "../user/user.dao.js"
import { getWorkspaceByidDto } from "../workspace/workspace.dao.js"
import { workspaceCreator } from "../membership/membership.authorization.js"

export const createThresholdService = async ({ metric, condition, workspace, value, notifyUser, createdBy }: iCreateThreshold) => {
    const metric_data = await getMetricByIdDto(metric)
    if (!metric_data) {
        const error = new Error('Metric not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    if (metric_data.workspace !== workspace) {
        const error = new Error(`Metric ${metric} does not belong to this ${workspace} workspace`) as AppError;
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

export const getThresholdsByMetricService = async ({ metric, user, cursor, limit }: iGetThresholds) => {
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

    return await getThresholdsByMetricDao({ metric, user, cursor, limit })
}

export const updateThresholdService = async ({ authUser, threshold, workspace, condition, value, notifyUser }: iUpdateThreshold) => {
    const threshold_data = await getThresholdByIdDao(threshold)

    if (threshold_data?.workspace !== workspace) {
        const error = new Error('Threshold is not valid!') as AppError;
        error.statusCode = 400;
        throw error;
    }

    await workspaceCreator({ authUser, workspace })

    if (notifyUser) {
        const user = await getUserByEmailDto(notifyUser)
        if (!user) {
            const error = new Error('Notify user not found') as AppError;
            error.statusCode = 400;
            throw error;
        }
    }

    await updateThresholdDto({ authUser, threshold, workspace, condition, value, notifyUser })
}

export const deleteThresholdService = async ({ authUser, threshold, workspace }: iDeleteThreshold) => {
    const threshold_data = await getThresholdByIdDao(threshold)

    if (threshold_data?.workspace !== workspace) {
        const error = new Error('Threshold is not valid!') as AppError;
        error.statusCode = 400;
        throw error;
    }

    await workspaceCreator({ authUser: authUser, workspace })
    await deleteThresholdDto(threshold)
}

