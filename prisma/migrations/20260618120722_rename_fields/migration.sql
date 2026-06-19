/*
  Warnings:

  - You are about to drop the column `razor_pay_event` on the `payment_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment_events" DROP COLUMN "razor_pay_event",
ADD COLUMN     "razorpay_event" TEXT;
