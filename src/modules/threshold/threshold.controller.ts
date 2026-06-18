import { Request, Response } from "express"
import { successResponse } from "../../utils/response.js"
import { createThresholdService, deleteThresholdService, getThresholdsByMetricService, updateThresholdService } from "./threshold.service.js"
import { workspaceCreator } from "../membership/membership.authorization.js"

export const createThreshold = async (req: Request, res: Response) => {
    const metric = req.params.metricId as string
    const workspace = req.params.workspaceId as string
    const { condition, value, notifyUser } = req.body
    const authUser = req.user!

    await workspaceCreator({ authUser: authUser.id, workspace })
    await createThresholdService({ metric, condition, workspace, value, notifyUser, createdBy: authUser.id })
    return successResponse(res, 201, 'Threshold created successfully')
}

export const getThresholdsByMetric = async (req: Request, res: Response) => {
    const metric = req.params.metricId as string
    const authUser = req.user!
    const cursor = req.query.cursor as string | undefined
    const limit = req.query.limit ? Number(req.query.limit) : 5

    const thresholds = await getThresholdsByMetricService({ metric, user: authUser.id, cursor, limit })
    return successResponse(res, 200, 'Thresholds fetched successfully', thresholds)
}

export const updateThreshold = async (req: Request, res: Response) => {
    const threshold = req.params.thresholdId as string
    const workspace = req.params.workspaceId as string
    const { condition, value, notifyUser } = req.body
    const authUser = req.user!

    await updateThresholdService({ authUser: authUser.id, threshold, workspace, condition, value, notifyUser })
    return successResponse(res, 200, 'Threshold updated successfully')
}

export const deleteThreshold = async (req: Request, res: Response) => {
    const threshold = req.params.thresholdId as string
    const workspace = req.params.workspaceId as string
    const authUser = req.user!

    await deleteThresholdService({ authUser: authUser.id, threshold, workspace })
    return successResponse(res, 200, 'Threshold deleted successfully')
}
