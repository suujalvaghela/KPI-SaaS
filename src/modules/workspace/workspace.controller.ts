import { Request, Response } from "express"
import { AppError, successResponse } from "../../utils/response.js";
import { createWorkspaceService } from "./workspace.service.js";

export const createWorkspace = async (req: Request, res: Response) => {
    const { body: { name, author } } = req;

    if (!name || !author) {
        const error = new Error('Name and author are required') as AppError;
        error.statusCode = 400;
        throw error;
    }

    await createWorkspaceService({ name, author })

    return successResponse(res, 201, 'Workspace created successfully');
}
export const getAllWorkspace = async (req: Request, res: Response) => { 
    
}
export const getWorkspaceByid = async (req: Request, res: Response) => { }
export const updateWorkspace = async (req: Request, res: Response) => { }
export const deleteWorkspace = async (req: Request, res: Response) => { }