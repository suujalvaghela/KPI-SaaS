import { z } from 'zod'
import { threshold_condition } from '../../generated/prisma/enums.js'

export const createThresholdParams = z.object({
    workspaceId: z.uuid(),
    metricId: z.uuid(),
})

export const getThresholdParams = z.object({
    metricId: z.uuid(),
})

export const updateThresholdParams = z.object({
    workspaceId: z.uuid(),
    thresholdId: z.uuid(),
})

export const deleteThresholdParams = z.object({
    workspaceId: z.uuid(),
    thresholdId: z.uuid(),
})

export const thresholdQuery = z.object({
    cursor: z.uuid().optional(),
    limit: z.coerce.number().min(1).max(20).optional()
})

export const createThresholdSchema = z.object({
    condition: z.enum(threshold_condition),
    value: z.number(),
    notifyUser: z.email()
})

export const updateThresholdSchema = z.object({
    condition: z.enum(threshold_condition).optional(),
    value: z.number().optional(),
    notifyUser: z.email().optional()
})
