import { Request, Response } from "express"
import { AppError, successResponse } from "../../utils/response.js";
import { createWorkspaceService, deleteWorkspaceService, updateWorkspaceService } from "./workspace.service.js";
import { getAllWorkspacesDto, getWorkspaceByidDto } from "./workspace.dao.js";
import { createMemberDto } from "../membership/membership.dao.js";
import { workspace_role } from "../../generated/prisma/enums.js";

export const createWorkspace = async (req: Request, res: Response) => {
    const { body: { name } } = req;
    const authUser = req.user!

    if (!name || !authUser.id) {
        const error = new Error('Name and author are required') as AppError;
        error.statusCode = 400;
        throw error;
    }

    const workspace = await createWorkspaceService({ name, author: authUser.id })
    await createMemberDto({ mUser: workspace.author, workspace: workspace.id, role: workspace_role.Creator })

    return successResponse(res, 201, 'Workspace created successfully');
}
export const getAllWorkspace = async (req: Request, res: Response) => {
    const workspaces = await getAllWorkspacesDto()
    return successResponse(res, 200, 'Workspaces retrieved successfully', workspaces)
}
export const getWorkspaceByid = async (req: Request, res: Response) => {
    const { params: { id } } = req;

    if (!id || typeof id !== 'string') {
        const error = new Error('Invalid workspace ID') as AppError;
        error.statusCode = 400;
        throw error;
    }

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

    await updateWorkspaceService(authUser, { id, name });

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