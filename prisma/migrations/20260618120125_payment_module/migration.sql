-- CreateEnum
CREATE TYPE "workspace_plan" AS ENUM ('free', 'pro');

-- CreateEnum
CREATE TYPE "payment_event" AS ENUM ('order_created', 'payment_success', 'payment_failed');

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('pending', 'failed', 'paid');

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "plan" "workspace_plan" NOT NULL DEFAULT 'free';

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "workspace" TEXT NOT NULL,
    "razorpayOrderId" TEXT NOT NULL,
    "razorpayPaymentId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" "subscription_status" NOT NULL DEFAULT 'pending',
    "next_billing_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_events" (
    "id" TEXT NOT NULL,
    "subscription_id" TEXT NOT NULL,
    "eventtype" "payment_event" NOT NULL,
    "razorpayEventId" TEXT,
    "details" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_razorpayOrderId_key" ON "subscriptions"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_razorpayPaymentId_key" ON "subscriptions"("razorpayPaymentId");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
