import { prisma } from "../../lib/prisma.js";
import { cursorPagination } from "../../utils/pagination.js";
export const createMetricDao = async ({ workspace, name, description, unit, creator }) => {
    return await prisma.metric.create({
        data: { workspace, name, description, unit, creator }
    });
};
export const getMetricByIdDao = async (id) => {
    return await prisma.metric.findUnique({
        where: { id }
    });
};
export const getMetricsByWorkspaceDao = async ({ user, workspace, cursor, limit }) => {
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
export const updateMetricDao = async ({ metric, name, description, unit }) => {
    return await prisma.metric.update({
        where: { id: metric },
        data: { name, description, unit }
    });
};
export const deleteMetricDao = async (metric) => {
    return await prisma.metric.delete({
        where: { id: metric }
    });
};
