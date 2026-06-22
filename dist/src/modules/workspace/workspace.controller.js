import { successResponse } from "../../utils/response.js";
import { createWorkspaceService, deleteWorkspaceService, getWorkspaceByIdService, updateWorkspaceService } from "./workspace.service.js";
import { getWorkspaceByidDao } from "./workspace.dao.js";
import { createMemberDao } from "../membership/membership.dao.js";
import { workspace_role } from "../../generated/prisma/enums.js";
import { workspaceCreator } from "../membership/membership.authorization.js";
import { getMyWorkspacesDao } from "./workspace.dao.js";
export const createWorkspace = async (req, res) => {
    const { body: { name } } = req;
    const authUser = req.user;
    const workspace = await createWorkspaceService({ name, author: authUser.id });
    await createMemberDao({ mUser: workspace.author, workspace: workspace.id, role: workspace_role.Creator });
    return successResponse(res, 201, 'Workspace created successfully');
};
export const getMyWorkspaces = async (req, res) => {
    const authUser = req.user;
    const cursor = req.query.cursor;
    const limit = req.query.limit ? Number(req.query.limit) : 5;
    const workspaces = await getMyWorkspacesDao({ authUser: authUser.id, cursor, limit });
    return successResponse(res, 200, "workspaces fetched successfully!", workspaces);
};
export const getWorkspaceByid = async (req, res) => {
    const { params: { id } } = req;
    const authUser = req.user;
    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid workspace ID');
        error.statusCode = 400;
        throw error;
    }
    await getWorkspaceByIdService({ user: authUser.id, workspace: id });
    const workspace = await getWorkspaceByidDao(id);
    if (!workspace) {
        const error = new Error('Workspace not found');
        error.statusCode = 404;
        throw error;
    }
    return successResponse(res, 200, 'Workspace retrieved successfully', workspace);
};
export const updateWorkspace = async (req, res) => {
    const { params: { id } } = req;
    const { body: { name } } = req;
    const authUser = req.user;
    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid workspace ID');
        error.statusCode = 400;
        throw error;
    }
    await workspaceCreator({ authUser: authUser.id, workspace: id });
    await updateWorkspaceService({ workspace: id, name });
    return successResponse(res, 200, "Workspace updated successfully");
};
export const deleteWorkspace = async (req, res) => {
    const { params: { id } } = req;
    const authUser = req.user;
    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid workspace ID');
        error.statusCode = 400;
        throw error;
    }
    await deleteWorkspaceService(authUser, id);
    return successResponse(res, 200, 'Workspace Deleted Successfully');
};
