import { z } from 'zod';
export const userParams = z.object({
    id: z.uuid()
});
export const userQuery = z.object({
    cursor: z.uuid().optional(),
    limit: z.coerce.number().min(1).max(20).optional()
});
export const updateUserSchema = z.object({
    name: z.string()
});
