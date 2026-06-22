import { Router } from "express";
import { authenticationMiddlewear } from "../../middlewares/authentication.js";
import { validate } from "../../middlewares/validation.js";
import { deleteNotification, getNotification, updateNotification } from "./notification.controller.js";
import { notificationQuery, notificationParams, updateNotificationSchema } from "./notification.validate.js";
const router = Router();
router.use(authenticationMiddlewear);
router.route('/').get(validate(notificationQuery, 'query'), getNotification);
router.route('/:id')
    .patch(validate(notificationParams, 'params'), validate(updateNotificationSchema, 'body'), updateNotification)
    .delete(validate(notificationParams, 'params'), deleteNotification);
export { router as notificationRoute };
