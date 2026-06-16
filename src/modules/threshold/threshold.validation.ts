import { z } from 'zod'
import { threshold_condition } from '../../generated/prisma/enums.js'

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
