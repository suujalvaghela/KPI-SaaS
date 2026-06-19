import { prisma } from "../../lib/prisma.js"
import { iCreatePaymentEvent, iCreateSubscription, iUpdatePayment } from "./payment.type.js"

export const createSubscriptionDto = async ({ workspace, razorpayOrder, amount }: iCreateSubscription) => {
    return await prisma.subscription.create({
        data: {
            workspace,
            razorpayOrder,
            amount,
            currency: 'INR',
            status: 'pending'
        }
    })
}

export const getSubscriptionByWorkspaceDto = async (workspace: string) => {
    return prisma.subscription.findFirst({
        where: {
            workspace
        }
    })
}

export const getSubscriptionByRazorpayDto = async (razorpayOrder: string) => {
    return prisma.subscription.findFirst({
        where: {
            razorpayOrder
        }
    })
}

export const updateSubscriptionDto = async ({ subscription, razorpayPayment, status, nextBillingDate }: iUpdatePayment) => {
    return await prisma.subscription.update({
        where: { id: subscription },
        data: {
            ...(razorpayPayment && { razorpayPayment }),
            status,
            ...(nextBillingDate && { nextBillingDate })
        }
    })
}

export const createPaymentEventDto = async ({ subscription, eventType, razorpayEvent, details }: iCreatePaymentEvent) => {
    return prisma.paymentEvent.create({
        data: {
            subscription,
            eventType,
            razorpayEvent,
            details
        }
    })
}