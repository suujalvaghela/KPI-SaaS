import { prisma } from "../../lib/prisma.js"
import { cursorPagination } from "../../utils/pagination.js"
import { iGetMyWorkspaces, iUpdateWorkspace, iWorkspace } from "./workspace.type.js"

export const createWorkspaceDao = ({ name, author }: iWorkspace) => {
    return prisma.workspace.create({
        data: {
            name,
            author
        }
    })
}

export const getMyWorkspacesDao = async ({ authUser, cursor, limit }: iGetMyWorkspaces) => {
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
    })

    return cursorPagination(workspaces, limit)
}

export const getWorkspaceByidDao = async (workspace: string) => {
    return prisma.workspace.findFirst({
        where: {
            id: workspace,
            deletedAt: null
        }
    })
}

export const updateWorkspaceDao = ({ workspace, name }: iUpdateWorkspace) => {
    return prisma.workspace.update({
        where: { id: workspace },
        data: { name }
    })
}

export const deleteWorkspaceDao = (id: string) => {
    return prisma.workspace.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })
}

