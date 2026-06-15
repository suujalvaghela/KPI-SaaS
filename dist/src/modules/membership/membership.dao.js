import { workspace_role } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
export const createMemberDto = async ({ mUser, workspace, role = workspace_role.Guest }) => {
    return prisma.membership.create({
        data: {
            user: mUser,
            workspace,
            role
        }
    });
};
export const getMemberByIdsDto = async ({ user, workspace }) => {
    return prisma.membership.findUnique({
        where: {
            user_workspace: {
                user,
                workspace
            }
        }
    });
};
export const getAllMembersDto = async () => { };
export const updateMemberDto = async ({ user, workspace, role }) => {
    return prisma.membership.update({
        where: {
            user_workspace: {
                user,
                workspace
            }
        },
        data: {
        // role
        }
    });
};
export const deleteMemberDto = async ({ user, workspace }) => {
    return prisma.membership.delete({
        where: {
            user_workspace: {
                user,
                workspace
            }
        }
    });
};
