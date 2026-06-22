import { workspace_role } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { cursorPagination } from "../../utils/pagination.js";
import { iCreateMember, iGetMember, iUpdateMember, iDeleteMember, iGetAllMember } from "./membership.type.js";
import { iWorkspacesMember } from "../workspace/workspace.type.js";

export const createMemberDao = async ({ mUser, workspace, role = workspace_role.GUEST }: iCreateMember) => {
    return prisma.membership.create({
        data: {
            user: mUser,
            workspace,
            role
        }
    })
}

export const getMemberByIdsDao = async ({ user, workspace }: iGetMember) => {
    return prisma.membership.findUnique({
        where: {
            user_workspace: {
                user,
                workspace
            }
        },
    })
}

export const getAllMembersByWorkspaceDao = async ({ user, workspace, cursor, limit }: iGetAllMember) => {
    const members = await prisma.membership.findMany({
        where: {
            workspace
        },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && {
            cursor: {
                id: cursor
            }
        })
    })

    return cursorPagination(members, limit)
}

export const getAllWorkspacesByMemberDao = async ({ authUser, user, cursor, limit }: iWorkspacesMember) => {
    const workspaces = await prisma.workspace.findMany({
        where: {
            AND: [{
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
            }],
            deletedAt: null
        },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && {
            cursor: {
                id: cursor
            }
        })
    })

    return cursorPagination(workspaces, limit)
}

export const updateMemberDao = async ({ user, workspace, role }: iUpdateMember) => {
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

export const deleteMemberDao = async ({ user, workspace }: iDeleteMember) => {
    return prisma.membership.delete({
        where: {
            user_workspace: {
                user,
                workspace
            }
        }
    })
}
