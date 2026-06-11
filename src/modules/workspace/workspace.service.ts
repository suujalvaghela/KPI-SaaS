import { iUpdateWorkspace, iWorkspace } from "./workspace.type.js"
import { createWorkspaceDto, deleteWorkspaceDto, getAllWorkspacesDto, getWorkspaceByidDto, updateWorkspaceDto } from "./workspace.dao.js"
import { AppError } from "../../utils/response.js";
import { getUserByIdDto } from "../user/user.dao.js";
import { AuthenticatedUser } from "../../utils/authUser.js";

export const createWorkspaceService = async ({ name, author }: iWorkspace) => {

    const user = await getUserByIdDto(author)

    if (!user) {
        const error = new Error('Author not found') as AppError;
        error.statusCode = 404;
        throw error;
    }

    const workspace = await createWorkspaceDto({ name, author });

    if (!workspace) {
        const error = new Error('Failed to create workspace') as AppError;
        error.statusCode = 500;
        throw error;
    }

    return workspace;
}

export const updateWorkspaceService = async (
    authUser: AuthenticatedUser, {
        id,
        name
    }: iUpdateWorkspace
) => {
    const workspace = await getWorkspaceByidDto(id)

    if (!workspace) {
        const error = new Error('workspace does not existing') as AppError;
        error.statusCode = 403;
        throw error;
    }

    if (workspace?.author !== authUser.id) {
        const error = new Error('Forbidden: You can update only your own workspace') as AppError;
        error.statusCode = 403;
        throw error;
    }

    await updateWorkspaceDto({ id, name })
}
export const deleteWorkspaceService = async (
    authUser: AuthenticatedUser,
    id: string
) => {
    const workspace = await getWorkspaceByidDto(id)

    if (!workspace) {
        const error = new Error('workspace does not existing') as AppError;
        error.statusCode = 403;
        throw error;
    }

    if (workspace?.author !== authUser.id) {
        const error = new Error('Forbidden: You can only delete your own workspace') as AppError;
        error.statusCode = 403;
        throw error;
    }

    await deleteWorkspaceDto(id);
}
