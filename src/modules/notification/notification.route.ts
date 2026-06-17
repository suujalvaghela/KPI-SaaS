import { Router } from "express"
import { authenticationMiddlewear } from "../../middlewares/authentication.js"
import { validate } from "../../middlewares/validation.js"
import { deleteNotification, getNotification, updateNotification } from "./notification.controller.js"
import { updateNotificationSchema } from "./notification.validation.js"

const router = Router()

router.use(authenticationMiddlewear)

router.route('/')
    .get(getNotification)

router.route('/:id')
    .patch(
        validate(updateNotificationSchema),
        updateNotification
    )
    .delete(deleteNotification)

export { router as notificationRoute }
