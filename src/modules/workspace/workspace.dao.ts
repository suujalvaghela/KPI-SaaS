import { prisma } from "../../lib/prisma.js"
import { iWorkspace } from "./workspace.type.js"

export const createWorkspaceDto = (data: iWorkspace) => {
    return prisma.workspace.create({
        data
    })
}

export const getAllWorkspaceDto = () => {
    return prisma.workspace.findMany({
        where: { deletedAt: null }
    })
}

export const getWorkspaceByidDto = () => { }
export const updateWorkspaceDto = () => { }
export const deleteWorkspaceDto = () => { }