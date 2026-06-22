import { prisma } from "../../lib/prisma.js"
import { iCreatePaymentEvent, iCreateSubscription, iUpdatePayment } from "./payment.type.js"

export const createSubscriptionDao = async ({ workspace, razorpayOrder, amount }: iCreateSubscription) => {
    return await prisma.subscription.create({
        data: {
            workspace,
            razorpayOrder,
            amount,
            currency: 'INR',
            status: 'PENDING'
        }
    })
}

export const getSubscriptionByWorkspaceDao = async (workspace: string) => {
    return prisma.subscription.findFirst({
        where: {
            workspace
        }
    })
}

export const getSubscriptionByRazorpayDao = async (razorpayOrder: string) => {
    return prisma.subscription.findFirst({
        where: {
            razorpayOrder
        }
    })
}

export const updateSubscriptionDao = async ({ subscription, razorpayPayment, status, nextBillingDate }: iUpdatePayment) => {
    return await prisma.subscription.update({
        where: { id: subscription },
        data: {
            ...(razorpayPayment && { razorpayPayment }),
            status,
            ...(nextBillingDate && { nextBillingDate })
        }
    })
}

export const createPaymentEventDao = async ({ subscription, eventType, razorpayEvent, details }: iCreatePaymentEvent) => {
    return prisma.paymentEvent.create({
        data: {
            subscription,
            eventType,
            razorpayEvent,
            details
        }
    })
}