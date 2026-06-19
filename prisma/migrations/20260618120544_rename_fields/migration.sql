/*
  Warnings:

  - You are about to drop the column `eventtype` on the `payment_events` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayEventId` on the `payment_events` table. All the data in the column will be lost.
  - You are about to drop the column `subscription_id` on the `payment_events` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayOrderId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `razorpayPaymentId` on the `subscriptions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razorpay_order]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpay_payment]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_type` to the `payment_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subscription` to the `payment_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `razorpay_order` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payment_events" DROP CONSTRAINT "payment_events_subscription_id_fkey";

-- DropIndex
DROP INDEX "subscriptions_razorpayOrderId_key";

-- DropIndex
DROP INDEX "subscriptions_razorpayPaymentId_key";

-- AlterTable
ALTER TABLE "payment_events" DROP COLUMN "eventtype",
DROP COLUMN "razorpayEventId",
DROP COLUMN "subscription_id",
ADD COLUMN     "event_type" "payment_event" NOT NULL,
ADD COLUMN     "razor_pay_event" TEXT,
ADD COLUMN     "subscription" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "razorpayOrderId",
DROP COLUMN "razorpayPaymentId",
ADD COLUMN     "razorpay_order" TEXT NOT NULL,
ADD COLUMN     "razorpay_payment" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_razorpay_order_key" ON "subscriptions"("razorpay_order");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_razorpay_payment_key" ON "subscriptions"("razorpay_payment");

-- AddForeignKey
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_subscription_fkey" FOREIGN KEY ("subscription") REFERENCES "subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
