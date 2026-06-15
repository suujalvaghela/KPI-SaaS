import { getMemberByIdsDto } from "./membership.dao.js";
export const workspaceCreator = async ({ authUser, workspace }) => {
    const member = await getMemberByIdsDto({ user: authUser, workspace });
    if (!member) {
        const error = new Error("Not a member");
        error.statusCode = 403;
        throw error;
    }
    if (member.role !== "Creator") {
        const error = new Error(`Route is not allowed for ${member.role}`);
        error.statusCode = 403;
        throw error;
    }
    return member;
};
