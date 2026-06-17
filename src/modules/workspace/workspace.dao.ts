import { prisma } from "../../lib/prisma.js"
import { cursorPagination } from "../../utils/pagination.js"
import { iGetMyWorkspaces, iUpdateWorkspace, iWorkspace } from "./workspace.type.js"

export const createWorkspaceDto = ({ name, author }: iWorkspace) => {
    return prisma.workspace.create({
        data: {
            name,
            author
        }
    })
}

export const getMyWorkspacesDto = async ({ authUser, cursor, limit }: iGetMyWorkspaces) => {
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

export const getWorkspaceByidDto = async (workspace: string) => {
    return prisma.workspace.findFirst({
        where: {
            id: workspace,
            deletedAt: null
        }
    })
}

export const updateWorkspaceDto = ({ workspace, name }: iUpdateWorkspace) => {
    return prisma.workspace.update({
        where: { id: workspace },
        data: { name }
    })
}

export const deleteWorkspaceDto = (id: string) => {
    return prisma.workspace.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })
}

