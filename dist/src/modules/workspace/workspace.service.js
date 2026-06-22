import { createWorkspaceDao, deleteWorkspaceDao, getWorkspaceByidDao, updateWorkspaceDao } from "./workspace.dao.js";
import { getUserByIdDao } from "../user/user.dao.js";
import { getMemberByIdsDao } from "../membership/membership.dao.js";
export const createWorkspaceService = async ({ name, author }) => {
    const user = await getUserByIdDao(author);
    if (!user) {
        const error = new Error('Author not found');
        error.statusCode = 404;
        throw error;
    }
    const workspace = await createWorkspaceDao({ name, author });
    if (!workspace) {
        const error = new Error('Failed to create workspace');
        error.statusCode = 500;
        throw error;
    }
    return workspace;
};
export const getWorkspaceByIdService = async ({ user, workspace }) => {
    const member = await getMemberByIdsDao({ user, workspace });
    if (!member) {
        const error = new Error('You are not a part of this workspace!');
        error.statusCode = 404;
        throw error;
    }
    return await getWorkspaceByidDao(workspace);
};
export const updateWorkspaceService = async ({ workspace, name }) => {
    const workspace_data = await getWorkspaceByidDao(workspace);
    if (!workspace_data) {
        const error = new Error('workspace does not existing');
        error.statusCode = 403;
        throw error;
    }
    await updateWorkspaceDao({ workspace, name });
};
export const deleteWorkspaceService = async (authUser, id) => {
    const workspace = await getWorkspaceByidDao(id);
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
    await deleteWorkspaceDao(id);
};
