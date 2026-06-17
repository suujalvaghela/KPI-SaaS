import { z } from 'zod';
export const createWorkspaceSchema = z.object({
    name: z.string().min(1, "name is required"),
});
export const updateWorkspaceSchema = z.object({
    name: z.string().optional()
});
