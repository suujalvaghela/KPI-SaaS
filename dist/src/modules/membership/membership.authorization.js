import { getMemberByIdsDto } from "./membership.dao.js";
export const workspaceCreator = async ({ authUser, workspace }) => {
    const member = await getMemberByIdsDto({ user: authUser, workspace });
    if (!member) {
        const error = new Error("Route is not allowed!");
        error.statusCode = 403;
        throw error;
    }
    else if (member.role !== "Creator") {
        const error = new Error(`Route is not allowed for ${member.role}`);
        error.statusCode = 403;
        throw error;
    }
    else {
        return member;
    }
};
