import { Router } from "express"
import { authenticationMiddlewear } from "../../middlewares/authentication.js"
import { initiateUpgrade, paymentWebhook, verifyPayment } from "./payment.controller.js"

const router = Router()

router.post("/webhook", paymentWebhook)

router.use(authenticationMiddlewear)

router.route('/upgrade/:workspaceId').post(initiateUpgrade)
router.route('/verify').post(verifyPayment)

export { router as paymentRoute }