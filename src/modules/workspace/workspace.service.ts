import { iWorkspace } from "./workspace.type.js"
import { createWorkspaceDto } from "./workspace.dao.js"
import { AppError } from "../../utils/response.js";
import { getUserByIdDto } from "../user/user.dao.js";

export const createWorkspaceService = async (data: iWorkspace) => {

    const user = await getUserByIdDto(data.author)

    if(!user) {
        const error = new Error('Author not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    const workspace = await createWorkspaceDto(data);

    if (!workspace) {
        const error = new Error('Failed to create workspace') as AppError;
        error.statusCode = 500;
        throw error;
    }

    return workspace;
}
export const getAllWorkspaceService = async () => { }
export const getWorkspaceByidService = async () => { }
export const updateWorkspaceService = async () => { }
export const deleteWorkspaceService = async () => { }