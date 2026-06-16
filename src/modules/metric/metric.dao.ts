import { prisma } from "../../lib/prisma.js"
import { iUpdateMetric } from "./metric.type.js"
import { iCreateMetric } from "./metric.type.js"

export const createMetricDto = async ({ workspace, name, description, unit, creator }: iCreateMetric) => {
    return await prisma.metric.create({
        data: { workspace, name, description, unit, creator }
    })
}

export const getMetricByIdDto = async (id: string) => {
    return await prisma.metric.findUnique({
        where: { id }
    })
}

export const getMetricsByWorkspaceDto = async (workspace: string) => {
    return await prisma.metric.findMany({
        where: { workspace }
    })
}


export const updateMetricDto = async ({ metric, name, description, unit }: iUpdateMetric) => {
    return await prisma.metric.update({
        where: { id: metric },
        data: { name, description, unit }
    })
}

export const deleteMetricDto = async (metric: string) => {
    return await prisma.metric.delete({
        where: { id: metric }
    })
}
