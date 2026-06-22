import { createPaymentEventDao, createSubscriptionDao, getSubscriptionByRazorpayDao, updateSubscriptionDao, getSubscriptionByWorkspaceDao } from "./payment.dao.js";
import { razorpayInstance } from "../../config/razorpay.js";
import crypto from 'crypto';
import { updateWorkspaceDao } from "../workspace/workspace.dao.js";
export const createSubscriptionService = async (authUser, workspace) => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        const error = new Error('Razorpay credentials are not configured');
        error.statusCode = 500;
        throw error;
    }
    const subscribed = await getSubscriptionByWorkspaceDao(workspace);
    if (subscribed && subscribed.status === "paid") {
        const error = new Error('Workspace already has active Pro subscription!');
        error.statusCode = 409;
        throw error;
    }
    const receipt = `ws_${workspace.slice(0, 8)}_${Date.now().toString(36)}`;
    const order = await razorpayInstance.orders.create({
        amount: 100,
        currency: 'INR',
        receipt,
        notes: {
            workspaceId: workspace,
            user: authUser
        }
    });
    const subscription = await createSubscriptionDao({ workspace, razorpayOrder: order.id, amount: Number(order.amount) });
    await createPaymentEventDao({ subscription: subscription.id, eventType: "order_created", razorpayEvent: order.id, details: order });
    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        subscriptionId: subscription.id,
        workspaceId: workspace
    };
};
export const verifyPaymentService = async ({ razorpayOrder, razorpayPayment, razorpaySignature }) => {
    const body = razorpayOrder + '|' + razorpayPayment;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');
    if (expectedSignature !== razorpaySignature) {
        const error = new Error('Invalid payment signature!');
        error.statusCode = 400;
        throw error;
    }
    const subscription = await getSubscriptionByRazorpayDao(razorpayOrder);
    if (!subscription) {
        const error = new Error('Subscription not found!');
        error.statusCode = 404;
        throw error;
    }
    await updateSubscriptionDao({ subscription: subscription.id, razorpayPayment, status: "paid", nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    await updateWorkspaceDao({ workspace: subscription.workspace, plan: 'pro' });
    await createPaymentEventDao({ subscription: subscription.id, eventType: 'payment_success', razorpayEvent: razorpayPayment, details: { razorpayOrder, razorpayPayment } });
};
export const paymentWebhookService = async ({ signature, body, event, order, payment }) => {
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest('hex');
    if (expectedSignature !== signature) {
        const error = new Error('Workspace already has active Pro subscription!');
        error.statusCode = 400;
        throw error;
    }
    const subscription = await getSubscriptionByRazorpayDao(order);
    if (!subscription) {
        const error = new Error("Subscription not found");
        error.statusCode = 404;
        throw error;
    }
    if (event === 'payment.authorized' || event === 'payment.captured') {
        await updateSubscriptionDao({ subscription: subscription.id, razorpayPayment: payment, status: "paid", nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
        await updateWorkspaceDao({ workspace: subscription.workspace, plan: "pro" });
        await createPaymentEventDao({ subscription: subscription.id, eventType: "payment_success", razorpayEvent: payment, details: order });
        console.log(`[WEBHOOK] ✅ Workspace ${subscription.workspace} upgraded to Pro`);
    }
    else if (event === 'payment.failed') {
        console.log(`Payment failed for workspace: ${subscription.workspace}`);
        await updateSubscriptionDao({ subscription: subscription.id, status: "failed", });
        await createPaymentEventDao({ subscription: subscription.id, eventType: "payment_failed", razorpayEvent: payment, details: order });
        console.log(`Payment failed for workspace ${subscription.workspace}`);
    }
};
