import { getWorkspaceByidDto } from "../workspace/workspace.dao.js";
import { getUserByIdDto } from "../user/user.dao.js";
import { createMemberDto } from "./membership.dao.js";
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
export const getMemberByIds = () => { };
