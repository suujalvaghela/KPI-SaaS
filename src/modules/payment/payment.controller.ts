import { Request, Response } from "express"
import { workspaceCreator } from "../membership/membership.authorization.js"
import { createSubscriptionService, paymentWebhookService, verifyPaymentService } from "./payment.service.js"
import { successResponse } from "../../utils/response.js"

export const initiateUpgrade = async (req: Request, res: Response) => {
    const workspace = req.params.workspaceId as string
    const { id: authUser } = req.user!

    await workspaceCreator({ authUser, workspace });
    const paymentOrder = await createSubscriptionService({authUser, workspace})
    return successResponse(res, 201, "Payment order created", paymentOrder)
}

export const verifyPayment = async (req: Request, res: Response) => {
    const { body: { razorpayOrder, razorpayPayment, razorpaySignature } } = req;

    await verifyPaymentService({ razorpayOrder, razorpayPayment, razorpaySignature })
    return successResponse(res, 200, "Payment verified and workspace upgraded to Pro")
}

export const paymentWebhook = async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"] as string
    const body = JSON.stringify(req.body)
    const event = req.body.event
    const order = req.body.payload.order.entity.id
    const payment = req.body.payload.payment.entity.id
    const paymentStatus = req.body.payload.payment.entity.status
    await paymentWebhookService({ signature, body, event, order, payment, paymentStatus })
    return successResponse(res, 200, "Payment verified and workspace upgraded to Pro")
}
