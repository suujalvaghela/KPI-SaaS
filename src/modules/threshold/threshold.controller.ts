import { Request, Response } from "express"
import { successResponse } from "../../utils/response.js"
import { createThresholdService, getThresholdsByMetricService, updateThresholdService } from "./threshold.service.js"
import { deleteThresholdDto } from "./threshold.dao.js"
import { workspaceCreator } from "../membership/membership.authorization.js"

export const createThreshold = async (req: Request, res: Response) => {
    const { condition, value, notifyUser } = req.body
    const metric = req.params.metricId as string
    const workspace = req.params.workspaceId as string
    const authUser = req.user!

    await workspaceCreator({ authUser: authUser.id, workspace })
    await createThresholdService({ metric, condition, workspace, value, notifyUser, createdBy: authUser.id })
    return successResponse(res, 201, 'Threshold created successfully')
}

export const getThresholdsByMetric = async (req: Request, res: Response) => {
    const metric = req.params.metricId as string
    const authUser = req.user!

    const thresholds = await getThresholdsByMetricService({ metric, user: authUser.id })
    return successResponse(res, 200, 'Thresholds fetched successfully', thresholds)
}

export const updateThreshold = async (req: Request, res: Response) => {
    const threshold = req.params.thresholdId as string
    const workspace = req.params.workspaceId as string
    const { condition, value, notifyUser } = req.body
    const authUser = req.user!

    await workspaceCreator({ authUser: authUser.id, workspace })
    await updateThresholdService({ threshold, condition, value, notifyUser })
    return successResponse(res, 200, 'Threshold updated successfully')
}

export const deleteThreshold = async (req: Request, res: Response) => {
    const threshold = req.params.thresholdId as string
    const workspace = req.params.workspaceId as string
    const authUser = req.user!

    await workspaceCreator({ authUser: authUser.id, workspace })
    await deleteThresholdDto(threshold)
    return successResponse(res, 200, 'Threshold deleted successfully')
}
