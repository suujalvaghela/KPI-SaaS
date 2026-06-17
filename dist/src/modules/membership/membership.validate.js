import { z } from "zod";
export const memberSchema = z.object({
    user: z.string().optional(),
    role: z.string().optional()
});
