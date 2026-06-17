import { prisma } from "../../lib/prisma.js"
import { cursorPagination } from "../../utils/pagination.js"
import { iGetThresholds, iUpdateThreshold } from "./threshold.type.js"
import { iCreateThreshold } from "./threshold.type.js"

export const createThresholdDao = async ({ metric, condition, workspace, value, notifyUser, createdBy }: iCreateThreshold) => {
    return await prisma.threshold.create({
        data: { metric, condition, workspace, value, notifyUser, createdBy }
    })
}

export const getThresholdsByMetricDao = async ({ metric, user, cursor, limit }: iGetThresholds) => {
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
    })
    return cursorPagination(thresholds, limit)
}

export const getThresholdsByMetricDao2 = async (metric: string) => {
    return await prisma.threshold.findMany({
        where: { metric },
        orderBy: { createdAt: 'desc' },
    })
}

export const getThresholdByIdDao = async (id: string) => {
    return await prisma.threshold.findUnique({
        where: { id }
    })
}

export const updateThresholdDto = async ({ authUser, threshold, workspace, condition, value, notifyUser }: iUpdateThreshold) => {
    return await prisma.threshold.update({
        where: { id: threshold },
        data: { condition, value, notifyUser }
    })
}

export const deleteThresholdDto = async (threshold: string) => {
    return await prisma.threshold.delete({
        where: { id: threshold }
    })
}
