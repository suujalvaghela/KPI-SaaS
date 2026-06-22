import { prisma } from "../../lib/prisma.js"
import { cursorPagination } from "../../utils/pagination.js"
import { iCreateDatapoint, iGetDatapoints } from "./datapoint.type.js"

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

export const getDatapointsByMetricDao = async ({ metric, user, cursor, limit }: iGetDatapoints) => {
    const datapoints = await prisma.datapoint.findMany({
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
        },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && {
            cursor: {
                id: cursor
            }
        })
    })

    return cursorPagination(datapoints, limit)
}

export const getDatapointByIdDao = async (id: string) => {
    return await prisma.datapoint.findUnique({
        where: { id }
    })
}

export const deleteDatapointDao = async (id: string) => {
    return await prisma.datapoint.delete({
        where: { id }
    })
}
