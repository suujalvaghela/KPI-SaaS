import { Request, Response } from "express"
import { successResponse } from "../../utils/response.js"
import { getMetricsByWorkspaceService, updateMetricService, deleteMetricService } from "./metric.service.js"
import { createMetricDao, getMetricByIdDao } from "./metric.dao.js"
import { AppError } from "../../utils/response.js"
import { workspaceCreator } from "../membership/membership.authorization.js"

export const createMetric = async (req: Request, res: Response) => {
    const { name, unit, description } = req.body
    const authUser = req.user!
    const workspace = req.params.workspaceId as string

    await workspaceCreator({ authUser: authUser.id, workspace })
    await createMetricDao({ workspace, name, description, unit, creator: authUser.id })
    return successResponse(res, 201, 'Metric created successfully')
}

export const getMetricsByWorkspace = async (req: Request, res: Response) => {
    const cursor = req.query.cursor as string | undefined
    const limit = req.query.limit ? Number(req.query.limit) : 5
    const authUser = req.user!
    const workspace = req.params.workspaceId as string
    const metrics = await getMetricsByWorkspaceService({ user: authUser.id, workspace, cursor, limit })
    return successResponse(res, 200, 'Metrics fetched successfully', metrics)
}

export const getMetricById = async (req: Request, res: Response) => {
    const metric = req.params.metricId as string
    const metric_data = await getMetricByIdDao(metric)
    if (!metric_data) {
        const error = new Error('Metric is not available!') as AppError;
        error.statusCode = 400;
        throw error;
    }
    return successResponse(res, 200, 'Metric fetched successfully', metric_data)
}

export const updateMetric = async (req: Request, res: Response) => {
    const metric = req.params.metricId as string
    const workspace = req.params.workspaceId as string
    const { name, description, unit } = req.body
    const authUser = req.user!

    await workspaceCreator({ authUser: authUser.id, workspace })
    await updateMetricService(authUser.id, { metric, name, description, unit })
    return successResponse(res, 200, 'Metric updated successfully')
}

export const deleteMetric = async (req: Request, res: Response) => {
    const authUser = req.user!
    const metric = req.params.metricId as string
    const workspace = req.params.workspaceId as string

    await workspaceCreator({ authUser: authUser.id, workspace })
    await deleteMetricService({ authUser: authUser.id, metric })
    return successResponse(res, 200, 'Metric deleted successfully')
}
