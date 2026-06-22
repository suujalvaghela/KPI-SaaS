import z, { string } from "zod";
export const createPolicySchema = z.object({
    role: string,
    resource: string,
    action: string
});
