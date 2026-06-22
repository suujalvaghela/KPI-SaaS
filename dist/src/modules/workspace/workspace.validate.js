import { z } from 'zod';
export const workspaceParams = z.object({
    id: z.uuid()
});
export const workspaceQuery = z.object({
    cursor: z.uuid().optional(),
    limit: z.coerce.number().min(1).max(20).optional()
});
export const createWorkspaceSchema = z.object({
    name: z.string().min(1, "name is required"),
});
export const updateWorkspaceSchema = z.object({
    name: z.string().optional()
});
