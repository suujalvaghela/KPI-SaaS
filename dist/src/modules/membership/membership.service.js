import { getWorkspaceByidDao } from "../workspace/workspace.dao.js";
import { getUserByIdDao } from "../user/user.dao.js";
import { createMemberDao, getMemberByIdsDao, getAllMembersByWorkspaceDao, updateMemberDao } from "./membership.dao.js";
export const createMemberService = async ({ mUser, workspace, role }) => {
    const memberWorkspace = await getWorkspaceByidDao(workspace);
    const memberUser = await getUserByIdDao(mUser);
    if (!memberUser) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
    if (!memberWorkspace) {
        const error = new Error('Workspace not found');
        error.statusCode = 404;
        throw error;
    }
    await createMemberDao({ mUser, workspace, role });
};
export const getAllMembersByWorkspaceService = async ({ user, workspace, cursor, limit }) => {
    const member = await getMemberByIdsDao({ user, workspace });
    if (!member) {
        const error = new Error('You are not a part of this workspace!');
        error.statusCode = 404;
        throw error;
    }
    return await getAllMembersByWorkspaceDao({ user, workspace, cursor, limit });
};
export const updateMemberService = async ({ user, workspace, role }) => {
    const workspace_data = await getWorkspaceByidDao(workspace);
    if (!workspace_data) {
        const error = new Error('Workspace Does not exist!');
        error.statusCode = 404;
        throw error;
    }
    if (workspace_data.author === user) {
        const error = new Error(`You can not change owner's Role!`);
        error.statusCode = 404;
        throw error;
    }
    await updateMemberDao({ user, workspace, role });
};
