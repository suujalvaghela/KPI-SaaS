import { z } from 'zod'

export const createMetricSchema = z.object({
    name: z.string().min(1, "Metric name is required"),
    description: z.string().optional(),
    unit: z.string().min(1, "Unit is required")
})

export const updateMetricSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    unit: z.string().optional()
})