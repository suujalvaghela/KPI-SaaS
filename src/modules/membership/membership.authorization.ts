import { AppError } from "../../utils/response.js";
import { getMemberByIdsDto } from "./membership.dao.js";
import { iMemberCreator } from "./membership.type.js";

export const workspaceCreator = async ({ authUser, workspace }: iMemberCreator) => {

    const member = await getMemberByIdsDto({ user: authUser, workspace })

    if (!member) {
        const error = new Error("Route is not allowed!") as AppError
        error.statusCode = 403
        throw error
    }
    else if (member.role !== "Creator") {
        const error = new Error(`Route is not allowed for ${member.role}`) as AppError;
        error.statusCode = 403;
        throw error;
    }
    else {
        return member;
    }
}