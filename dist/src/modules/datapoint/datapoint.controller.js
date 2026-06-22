import { successResponse } from "../../utils/response.js";
import { createDatapointService, deleteDatapointService, getDatapointsByMetricService, } from "./datapoint.service.js";
import { workspaceCreator } from "../membership/membership.authorization.js";
import { getIO } from "../../socket/socket.js";
import { thresholdQueue } from "../../queue/threshold.js";
export const createDatapoint = async (req, res) => {
    const { value, timestamp } = req.body;
    const metric = req.params.metricId;
    const workspace = req.params.workspaceId;
    const authUser = req.user;
    await createDatapointService({ authUser: authUser.id, metric, value, timestamp, workspace });
    getIO()
        .to(`workspace_${workspace}`)
        .emit("datapoint:new", { metric, value, timestamp });
    await thresholdQueue.add("check-threshold", { metric, value, timestamp });
    return successResponse(res, 201, 'Datapoint created successfully');
};
export const getDatapointsByMetric = async (req, res) => {
    const metric = req.params.metricId;
    const cursor = req.query.cursor;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const authUser = req.user;
    const datapoints = await getDatapointsByMetricService({ metric, user: authUser.id, cursor, limit });
    return successResponse(res, 200, 'Datapoints fetched successfully', datapoints);
};
export const deleteDatapoint = async (req, res) => {
    const datapoint = req.params.datapointId;
    const workspace = req.params.workspaceId;
    const authUser = req.user;
    await workspaceCreator({ authUser: authUser.id, workspace });
    await deleteDatapointService({ authUser: authUser.id, datapoint, workspace });
    return successResponse(res, 200, 'Datapoint deleted successfully');
};
