import { workspace_role } from "../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { cursorPagination } from "../../utils/pagination.js";
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
        },
    });
};
export const getAllMembersByWorkspaceDto = async ({ user, workspace, cursor, limit }) => {
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
    });
    return cursorPagination(members, limit);
};
export const getAllWorkspacesByMemberDto = async ({ authUser, user, cursor, limit }) => {
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
    });
    return cursorPagination(workspaces, limit);
};
export const updateMemberDto = async ({ user, workspace, role }) => {
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
