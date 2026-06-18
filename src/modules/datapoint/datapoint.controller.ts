import { Request, Response } from "express"
import { successResponse } from "../../utils/response.js"
import { createDatapointService, deleteDatapointService, getDatapointsByMetricService, } from "./datapoint.service.js"
import { workspaceCreator } from "../membership/membership.authorization.js"
import { getIO } from "../../socket/socket.js"
import { thresholdQueue } from "../../queue/threshold.js"

export const createDatapoint = async (req: Request, res: Response) => {
    const { value, timestamp } = req.body
    const metric = req.params.metricId as string
    const workspace = req.params.workspaceId as string
    const authUser = req.user!

    await createDatapointService({ authUser: authUser.id, metric, value, timestamp, workspace })
    getIO()
        .to(`workspace_${workspace}`)
        .emit("datapoint:new", { metric, value, timestamp })

    await thresholdQueue.add("check-threshold", { metric, value, timestamp })
    return successResponse(res, 201, 'Datapoint created successfully')
}

export const getDatapointsByMetric = async (req: Request, res: Response) => {
    const metric = req.params.metricId as string
    const cursor = req.query.cursor as string | undefined
    const limit = req.query.limit ? Number(req.query.limit) : 5
    const authUser = req.user!

    const datapoints = await getDatapointsByMetricService({ metric, user: authUser.id, cursor, limit })
    return successResponse(res, 200, 'Datapoints fetched successfully', datapoints)
}

export const deleteDatapoint = async (req: Request, res: Response) => {
    const datapoint = req.params.datapointId as string
    const workspace = req.params.workspaceId as string
    const authUser = req.user!

    await workspaceCreator({ authUser: authUser.id, workspace })
    await deleteDatapointService({ authUser: authUser.id, datapoint, workspace })
    return successResponse(res, 200, 'Datapoint deleted successfully')
}
