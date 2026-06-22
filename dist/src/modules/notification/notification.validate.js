import { z } from 'zod';
export const notificationParams = z.object({
    id: z.uuid()
});
export const notificationQuery = z.object({
    cursor: z.uuid().optional(),
    limit: z.coerce.number().min(1).max(20).optional()
});
export const updateNotificationSchema = z.object({
    isRead: z.boolean()
});
