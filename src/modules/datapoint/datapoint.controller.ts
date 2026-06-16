import { Request, Response } from "express"
import { successResponse } from "../../utils/response.js"
import { createDatapointService, getDatapointsByMetricService, } from "./datapoint.service.js"
import { workspaceCreator } from "../membership/membership.authorization.js"
import { deleteDatapointDto } from "./datapoint.dao.js"

export const createDatapoint = async (req: Request, res: Response) => {
    const { value, timestamp } = req.body
    const metric = req.params.metricId as string
    const authUser = req.user!

    await createDatapointService({ authUser: authUser.id, metric, value, timestamp })
    return successResponse(res, 201, 'Datapoint created successfully')
}

export const getDatapointsByMetric = async (req: Request, res: Response) => {
    const metric = req.params.metricId as string
    const authUser = req.user!

    const datapoints = await getDatapointsByMetricService({ metric, user: authUser.id })
    return successResponse(res, 200, 'Datapoints fetched successfully', datapoints)
}

export const deleteDatapoint = async (req: Request, res: Response) => {
    const datapoint = req.params.datapointId as string
    const workspace = req.params.workspaceId as string
    const authUser = req.user!

    await workspaceCreator({ authUser: authUser.id, workspace })
    await deleteDatapointDto(datapoint)
    return successResponse(res, 200, 'Datapoint deleted successfully')
}
