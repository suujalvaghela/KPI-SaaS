import { prisma } from "../../lib/prisma.js"
import { iCreateDatapoint } from "./datapoint.type.js"

export const createDatapointDao = async ({ authUser, metric, value, timestamp }: iCreateDatapoint) => {
    return await prisma.datapoint.create({
        data: {
            metric,
            value,
            timestamp,
            creator: authUser
        }
    })
}

export const getDatapointsByMetricDao = async (metric: string) => {
    return await prisma.datapoint.findMany({
        where: { metric },
        orderBy: { timestamp: 'desc' },
        select: {
            id: true,
            creator: true,
            metrics: {
                select: {
                    id: true,
                    workspace: true
                }
            },
            value: true,
            timestamp: true,
            createdAt: true,
            updatedAt: true
        }
    })
}

export const getDatapointByIdDao = async (id: string) => {
    return await prisma.datapoint.findUnique({
        where: { id }
    })
}

export const deleteDatapointDto = async (id: string) => {
    return await prisma.datapoint.delete({
        where: { id }
    })
}
