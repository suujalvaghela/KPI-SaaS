import { getWorkspaceByidDto } from "../workspace/workspace.dao.js";
import { getUserByIdDto } from "../user/user.dao.js";
import { createMemberDto, getMemberByIdsDto, getAllMembersByWorkspaceDto, updateMemberDto } from "./membership.dao.js";
export const createMemberService = async ({ mUser, workspace, role }) => {
    const memberWorkspace = await getWorkspaceByidDto(workspace);
    const memberUser = await getUserByIdDto(mUser);
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
    await createMemberDto({ mUser, workspace, role });
};
export const getAllMembersByWorkspaceService = async ({ user, workspace, cursor, limit }) => {
    const member = await getMemberByIdsDto({ user, workspace });
    if (!member) {
        const error = new Error('You are not a part of this workspace!');
        error.statusCode = 404;
        throw error;
    }
    return await getAllMembersByWorkspaceDto({ user, workspace, cursor, limit });
};
export const updateMemberService = async ({ user, workspace, role }) => {
    const workspace_data = await getWorkspaceByidDto(workspace);
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
    await updateMemberDto({ user, workspace, role });
};
