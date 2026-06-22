import { z } from 'zod';
export const createMetricParams = z.object({
    workspaceId: z.uuid()
});
export const getMetricByWorkspaceParams = z.object({
    workspaceId: z.uuid()
});
export const getMetricParams = z.object({
    workspaceId: z.uuid(),
    metricId: z.uuid()
});
export const updateMetricParams = z.object({
    workspaceId: z.uuid(),
    metricId: z.uuid()
});
export const deleteMetricParams = z.object({
    workspaceId: z.uuid(),
    metricId: z.uuid()
});
export const metricQuery = z.object({
    cursor: z.uuid().optional(),
    limit: z.coerce.number().min(1).max(20).optional()
});
export const createMetricSchema = z.object({
    name: z.string().min(1, "Metric name is required"),
    description: z.string().optional(),
    unit: z.string().min(1, "Unit is required")
});
export const updateMetricSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    unit: z.string().optional()
});
