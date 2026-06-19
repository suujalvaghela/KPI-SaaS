import { createPaymentEventDto, createSubscriptionDto, getSubscriptionByRazorpayDto, updateSubscriptionDto, getSubscriptionByWorkspaceDto } from "./payment.dao.js"
import { AppError } from "../../utils/response.js";
import { razorpayInstance } from "../../config/razorpay.js";
import crypto from 'crypto'
import { updateWorkspaceDto } from "../workspace/workspace.dao.js"
import { iVerify, iWebC } from "./payment.type.js";

export const createSubscriptionService = async (authUser: string, workspace: string) => {
    const subscribed = await getSubscriptionByWorkspaceDto(workspace)
    if (subscribed && subscribed.status === "paid") {
        const error = new Error('Workspace already has active Pro subscription!') as AppError;
        error.statusCode = 404;
        throw error;
    }
    const order = await razorpayInstance.orders.create({
        amount: 9,
        currency: 'INR',
        receipt: `workspace_${workspace}_${Date.now()}`,
        notes: {
            workspaceId: workspace,
            user: authUser
        }
    })
    const subscription = await createSubscriptionDto({ workspace, razorpayOrder: order.id, amount: Number(order.amount) })
    await createPaymentEventDto({ subscription: subscription.id, eventType: "order_created", razorpayEvent: order.id, details: order })
}

export const verifyPaymentService = async ({ razorpayOrder, razorpayPayment, razorpaySignature }: iVerify) => {
    const body = razorpayOrder + '|' + razorpayPayment;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

    if (expectedSignature !== razorpaySignature) {
        const error = new Error('Invalid payment signature!') as AppError;
        error.statusCode = 400;
        throw error;
    }
    const subscription = await getSubscriptionByRazorpayDto(razorpayOrder)
    if (!subscription) {
        const error = new Error('Subscription not found!') as AppError;
        error.statusCode = 404;
        throw error;
    }

    await updateSubscriptionDto({ subscription: subscription.id, razorpayPayment, status: "paid", nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
    await updateWorkspaceDto({ workspace: subscription.workspace, plan: 'pro' })
    await createPaymentEventDto({ subscription: subscription.id, eventType: 'payment_success', razorpayEvent: razorpayPayment, details: { razorpayOrder, razorpayPayment } })
}

export const paymentWebhookService = async ({ signature, body, event, order, payment }: iWebC) => {
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest('hex')

    if (expectedSignature !== signature) {
        const error = new Error('Workspace already has active Pro subscription!') as AppError;
        error.statusCode = 400;
        throw error;
    }

    const subscription = await getSubscriptionByRazorpayDto(order)
    if (!subscription) {
        const error = new Error("Subscription not found") as AppError;
        error.statusCode = 404;
        throw error;
    }

    if (event === 'payment.authorized' || event === 'payment.captured') {
        await updateSubscriptionDto({ subscription: subscription.id, razorpayPayment: payment, status: "paid", nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
        await updateWorkspaceDto({ workspace: subscription.workspace, plan: "pro" })
        await createPaymentEventDto({ subscription: subscription.id, eventType: "payment_success", razorpayEvent: payment, details: order })
        console.log(`[WEBHOOK] ✅ Workspace ${subscription.workspace} upgraded to Pro`)
    }
    else if (event === 'payment.failed') {
        console.log(`Payment failed for workspace: ${subscription.workspace}`)
        await updateSubscriptionDto({ subscription: subscription.id, status: "failed", })
        await createPaymentEventDto({ subscription: subscription.id, eventType: "payment_failed", razorpayEvent: payment, details: order })
        console.log(`Payment failed for workspace ${subscription.workspace}`)
    }
}