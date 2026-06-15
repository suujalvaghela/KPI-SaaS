import { workspace_role } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { iCreateMember, iGetMember, iUpdateMember, iDeleteMember, iWorkspacesMember } from "./membership.type.js";

export const createMemberDto = async ({
    mUser,
    workspace,
    role = workspace_role.Guest
}: iCreateMember
) => {
    return prisma.membership.create({
        data: {
            user: mUser,
            workspace,
            role
        }
    })
}

export const getMemberByIdsDto = async ({ user, workspace }: iGetMember) => {
    return prisma.membership.findUnique({
        where: {
            user_workspace: {
                user,
                workspace
            }
        }
    })
}

export const getAllMembersByWorkspaceDto = async (workspace: string) => {
    return prisma.membership.findMany({
        where: {
            workspace
        }
    })
}

export const getAllWorkspacesByMemberDto = async ({ authUser, user }: iWorkspacesMember) => {
    return prisma.workspace.findMany({
        where: {
            AND: [
                {
                    memberships: {
                        some: {
                            user: authUser
                        }
                    }
                },
                {
                    memberships: {
                        some: {
                            user
                        }
                    }
                }
            ]
        }
    })
}

export const updateMemberDto = async ({ user, workspace, role }: iUpdateMember) => {
    return prisma.membership.update({
        where: {
            user_workspace: {
                user,
                workspace
            }
        },
        data: {
            role
        }
    })
}

export const deleteMemberDto = async ({ user, workspace }: iGetMember) => {
    return prisma.membership.delete({
        where: {
            user_workspace: {
                user,
                workspace
            }
        }
    })
}
