import { z } from 'zod'

export const createDatapointParams = z.object({
    workspaceId: z.uuid(),
    metricId: z.uuid(),
})

export const getDatapointParams = z.object({
    metricId: z.uuid()
})

export const deleteDatapointParams = z.object({
    datapointId: z.uuid(),
    workspaceId: z.uuid(),
})

export const datapointQuery = z.object({
    cursor: z.uuid().optional(),
    limit: z.coerce.number().int().min(1).max(20).optional()
})

export const createDatapointSchema = z.object({
    value: z.number(),
    timestamp: z.string().optional()
})

