import { prisma } from "../../lib/prisma.js";
export const createWorkspaceDto = ({ name, author }) => {
    return prisma.workspace.create({
        data: {
            name,
            author
        }
    });
};
export const getAllWorkspacesDto = () => {
    return prisma.workspace.findMany({
        where: { deletedAt: null }
    });
};
export const getWorkspaceByidDto = async (id) => {
    return prisma.workspace.findUnique({
        where: {
            id,
            deletedAt: null
        }
    });
};
export const updateWorkspaceDto = ({ id, name }) => {
    return prisma.workspace.update({
        where: { id },
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
