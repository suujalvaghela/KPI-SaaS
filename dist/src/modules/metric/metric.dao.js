import { prisma } from "../../lib/prisma.js";
import { cursorPagination } from "../../utils/pagination.js";
export const createMetricDto = async ({ workspace, name, description, unit, creator }) => {
    return await prisma.metric.create({
        data: { workspace, name, description, unit, creator }
    });
};
export const getMetricByIdDto = async (id) => {
    return await prisma.metric.findUnique({
        where: { id }
    });
};
export const getMetricsByWorkspaceDto = async ({ user, workspace, cursor, limit }) => {
    const metrics = await prisma.metric.findMany({
        where: { workspace },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && {
            cursor: {
                id: cursor
            }
        })
    });
    return cursorPagination(metrics, limit);
};
export const updateMetricDto = async ({ metric, name, description, unit }) => {
    return await prisma.metric.update({
        where: { id: metric },
        data: { name, description, unit }
    });
};
export const deleteMetricDto = async (metric) => {
    return await prisma.metric.delete({
        where: { id: metric }
    });
};
