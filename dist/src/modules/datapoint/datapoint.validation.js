import { z } from 'zod';
export const createDatapointSchema = z.object({
    value: z.number(),
    timestamp: z.string().optional()
});
