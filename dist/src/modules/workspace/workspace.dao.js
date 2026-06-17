import { prisma } from "../../lib/prisma.js";
import { cursorPagination } from "../../utils/pagination.js";
export const createWorkspaceDto = ({ name, author }) => {
    return prisma.workspace.create({
        data: {
            name,
            author
        }
    });
};
export const getMyWorkspacesDto = async ({ authUser, cursor, limit }) => {
    const workspaces = await prisma.workspace.findMany({
        where: {
            memberships: {
                some: {
                    user: authUser
                }
            },
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
export const getWorkspaceByidDto = async (workspace) => {
    return prisma.workspace.findFirst({
        where: {
            id: workspace,
            deletedAt: null
        }
    });
};
export const updateWorkspaceDto = ({ workspace, name }) => {
    return prisma.workspace.update({
        where: { id: workspace },
        data: { name }
    });
};
export const deleteWorkspaceDto = (id) => {
    return prisma.workspace.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    });
};
