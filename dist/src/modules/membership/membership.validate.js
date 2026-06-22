import { z } from "zod";
export const createMemberParams = z.object({
    workspaceId: z.uuid(),
});
export const getAllMembersByWorkspaceParams = z.object({
    workspaceId: z.uuid(),
});
export const getAlWorkspacesByMemberParams = z.object({
    userId: z.uuid(),
});
export const updateMemberParams = z.object({
    workspaceId: z.uuid(),
    memberId: z.uuid()
});
export const deleteMemberParams = z.object({
    workspaceId: z.uuid(),
    memberId: z.uuid()
});
export const memberQuery = z.object({
    cursor: z.uuid().optional(),
    limit: z.coerce.number().min(1).max(20).optional()
});
export const memberSchema = z.object({
    user: z.string().optional(),
    role: z.string().optional()
});
