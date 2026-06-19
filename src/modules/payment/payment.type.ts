import { payment_event, subscription_status } from "../../generated/prisma/enums.js"

export interface iCreateSubscription {
    workspace: string
    razorpayOrder: string
    amount: number
}

export interface iCreatePaymentEvent {
    subscription: string,
    eventType: payment_event,
    razorpayEvent?: string,
    details: any
}

export interface iUpdatePayment {
    subscription: string,
    razorpayPayment?: string,
    status: subscription_status,
    nextBillingDate?: Date
}

export interface iVerify {
    razorpayOrder: string,
    razorpayPayment: string,
    razorpaySignature: string
}

export interface iWebC {
    signature: string,
    body: string,
    event: string,
    order: string,
    payment: string,
    paymentStatus?: string
}