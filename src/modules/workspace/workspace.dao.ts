import { prisma } from "../../lib/prisma.js"
import { iUpdateUser } from "../user/user.type.js"
import { iUpdateWorkspace, iWorkspace } from "./workspace.type.js"

export const createWorkspaceDto = ({ name, author }: iWorkspace) => {
    return prisma.workspace.create({
        data: {
            name,
            author
        }
    })
}

export const getWorkspaceByidDto = async (workspace: string) => {
    return prisma.workspace.findUnique({
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

