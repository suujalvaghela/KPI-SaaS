import { createWorkspaceDto, deleteWorkspaceDto, getWorkspaceByidDto, updateWorkspaceDto } from "./workspace.dao.js";
import { getUserByIdDto } from "../user/user.dao.js";
export const createWorkspaceService = async ({ name, author }) => {
    const user = await getUserByIdDto(author);
    if (!user) {
        const error = new Error('Author not found');
        error.statusCode = 404;
        throw error;
    }
    const workspace = await createWorkspaceDto({ name, author });
    if (!workspace) {
        const error = new Error('Failed to create workspace');
        error.statusCode = 500;
        throw error;
    }
    return workspace;
};
export const updateWorkspaceService = async (authUser, { id, name }) => {
    const workspace = await getWorkspaceByidDto(id);
    if (!workspace) {
        const error = new Error('workspace does not existing');
        error.statusCode = 403;
        throw error;
    }
    if (workspace?.author !== authUser.id) {
        const error = new Error('Forbidden: You can update only your own workspace');
        error.statusCode = 403;
        throw error;
    }
    await updateWorkspaceDto({ id, name });
};
export const deleteWorkspaceService = async (authUser, id) => {
    const workspace = await getWorkspaceByidDto(id);
    if (!workspace) {
        const error = new Error('workspace does not existing');
        error.statusCode = 403;
        throw error;
    }
    if (workspace?.author !== authUser.id) {
        const error = new Error('Forbidden: You can only delete your own workspace');
        error.statusCode = 403;
        throw error;
    }
    await deleteWorkspaceDto(id);
};
