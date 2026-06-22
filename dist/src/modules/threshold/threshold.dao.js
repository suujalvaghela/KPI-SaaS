import { prisma } from "../../lib/prisma.js";
import { cursorPagination } from "../../utils/pagination.js";
export const createThresholdDao = async ({ metric, condition, workspace, value, notifyUser, createdBy }) => {
    return await prisma.threshold.create({
        data: { metric, condition, workspace, value, notifyUser, createdBy }
    });
};
export const getThresholdsByMetricDao = async ({ metric, user, cursor, limit }) => {
    const thresholds = await prisma.threshold.findMany({
        where: { metric },
        orderBy: { createdAt: 'desc' },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && {
            cursor: {
                id: cursor
            }
        })
    });
    return cursorPagination(thresholds, limit);
};
export const getThresholdsByMetricDao2 = async (metric) => {
    return await prisma.threshold.findMany({
        where: { metric },
        orderBy: { createdAt: 'desc' },
    });
};
export const getThresholdByIdDao = async (id) => {
    return await prisma.threshold.findUnique({
        where: { id }
    });
};
export const updateThresholdDao = async ({ authUser, threshold, workspace, condition, value, notifyUser }) => {
    return await prisma.threshold.update({
        where: { id: threshold },
        data: { condition, value, notifyUser }
    });
};
export const deleteThresholdDao = async (threshold) => {
    return await prisma.threshold.delete({
        where: { id: threshold }
    });
};
