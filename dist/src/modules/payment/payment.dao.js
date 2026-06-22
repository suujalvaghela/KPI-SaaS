import { prisma } from "../../lib/prisma.js";
export const createSubscriptionDao = async ({ workspace, razorpayOrder, amount }) => {
    return await prisma.subscription.create({
        data: {
            workspace,
            razorpayOrder,
            amount,
            currency: 'INR',
            status: 'PENDING'
        }
    });
};
export const getSubscriptionByWorkspaceDao = async (workspace) => {
    return prisma.subscription.findFirst({
        where: {
            workspace
        }
    });
};
export const getSubscriptionByRazorpayDao = async (razorpayOrder) => {
    return prisma.subscription.findFirst({
        where: {
            razorpayOrder
        }
    });
};
export const updateSubscriptionDao = async ({ subscription, razorpayPayment, status, nextBillingDate }) => {
    return await prisma.subscription.update({
        where: { id: subscription },
        data: {
            ...(razorpayPayment && { razorpayPayment }),
            status,
            ...(nextBillingDate && { nextBillingDate })
        }
    });
};
export const createPaymentEventDao = async ({ subscription, eventType, razorpayEvent, details }) => {
    return prisma.paymentEvent.create({
        data: {
            subscription,
            eventType,
            razorpayEvent,
            details
        }
    });
};
