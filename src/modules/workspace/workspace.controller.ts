import { Request, Response } from "express"
import { AppError, successResponse } from "../../utils/response.js";
import { createWorkspaceService, deleteWorkspaceService, getWorkspaceByIdService, updateWorkspaceService } from "./workspace.service.js";
import { getWorkspaceByidDto } from "./workspace.dao.js";
import { createMemberDto } from "../membership/membership.dao.js";
import { workspace_role } from "../../generated/prisma/enums.js";
import { workspaceCreator } from "../membership/membership.authorization.js";
import { getMyWorkspacesDto } from "./workspace.dao.js";

export const createWorkspace = async (req: Request, res: Response) => {
    const { body: { name } } = req;
    const authUser = req.user!

    const workspace = await createWorkspaceService({ name, author: authUser.id })
    await createMemberDto({ mUser: workspace.author, workspace: workspace.id, role: workspace_role.Creator })

    return successResponse(res, 201, 'Workspace created successfully');
}

export const getMyWorkspaces = async (req: Request, res: Response) => {
    const authUser = req.user!
    const cursor = req.query.cursor as string | undefined
    const limit = req.query.limit ? Number(req.query.limit) : 5
    const workspaces = await getMyWorkspacesDto({ authUser: authUser.id, cursor, limit })
    return successResponse(res, 200, "workspaces fetched successfully!", workspaces);
}

export const getWorkspaceByid = async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const authUser = req.user!

    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid workspace ID') as AppError;
        error.statusCode = 400;
        throw error;
    }

    await getWorkspaceByIdService({ user: authUser.id, workspace: id })
    const workspace = await getWorkspaceByidDto(id);

    if (!workspace) {
        const error = new Error('Workspace not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    return successResponse(res, 200, 'Workspace retrieved successfully', workspace)
}

export const updateWorkspace = async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const { body: { name } } = req;
    const authUser = req.user!;

    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid workspace ID') as AppError;
        error.statusCode = 400;
        throw error;
    }

    await workspaceCreator({ authUser: authUser.id, workspace: id })
    await updateWorkspaceService({ workspace: id, name });
    return successResponse(res, 200, "Workspace updated successfully")
}

export const deleteWorkspace = async (req: Request, res: Response) => {
    const { params: { id } } = req;
    const authUser = req.user!

    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid workspace ID') as AppError;
        error.statusCode = 400;
        throw error;
    }

    await deleteWorkspaceService(authUser, id)
    return successResponse(res, 200, 'Workspace Deleted Successfully')

}