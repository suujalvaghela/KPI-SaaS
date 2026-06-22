import { AppError } from "../../utils/response.js";
import { getMemberByIdsDao } from "./membership.dao.js";
import { iMemberCreator } from "./membership.type.js";

export const workspaceCreator = async ({ authUser, workspace }: iMemberCreator) => {

    const member = await getMemberByIdsDao({ user: authUser, workspace })

    if (!member) {
        const error = new Error("Route is not allowed!") as AppError
        error.statusCode = 403
        throw error
    }
    else if (member.role !== "CREATOR") {
        const error = new Error(`Route is not allowed for ${member.role}`) as AppError;
        error.statusCode = 403;
        throw error;
    }
    else {
        return member;
    }
}