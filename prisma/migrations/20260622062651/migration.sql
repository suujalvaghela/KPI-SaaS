/*
  Warnings:

  - The values [order_created,payment_success,payment_failed] on the enum `payment_event` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,failed,paid] on the enum `subscription_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [free,pro] on the enum `workspace_plan` will be removed. If these variants are still used in the database, this will fail.
  - The values [Creator,Guest] on the enum `workspace_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "payment_event_new" AS ENUM ('ORDER_CREATED', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED');
ALTER TABLE "payment_events" ALTER COLUMN "event_type" TYPE "payment_event_new" USING ("event_type"::text::"payment_event_new");
ALTER TYPE "payment_event" RENAME TO "payment_event_old";
ALTER TYPE "payment_event_new" RENAME TO "payment_event";
DROP TYPE "public"."payment_event_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "subscription_status_new" AS ENUM ('PENDING', 'FAILED', 'PAID');
ALTER TABLE "public"."subscriptions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "subscriptions" ALTER COLUMN "status" TYPE "subscription_status_new" USING ("status"::text::"subscription_status_new");
ALTER TYPE "subscription_status" RENAME TO "subscription_status_old";
ALTER TYPE "subscription_status_new" RENAME TO "subscription_status";
DROP TYPE "public"."subscription_status_old";
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "workspace_plan_new" AS ENUM ('FREE', 'PRO');
ALTER TABLE "public"."workspaces" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "workspaces" ALTER COLUMN "plan" TYPE "workspace_plan_new" USING ("plan"::text::"workspace_plan_new");
ALTER TYPE "workspace_plan" RENAME TO "workspace_plan_old";
ALTER TYPE "workspace_plan_new" RENAME TO "workspace_plan";
DROP TYPE "public"."workspace_plan_old";
ALTER TABLE "workspaces" ALTER COLUMN "plan" SET DEFAULT 'FREE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "workspace_role_new" AS ENUM ('CREATOR', 'GUEST');
ALTER TABLE "public"."memberships" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "memberships" ALTER COLUMN "role" TYPE "workspace_role_new" USING ("role"::text::"workspace_role_new");
ALTER TYPE "workspace_role" RENAME TO "workspace_role_old";
ALTER TYPE "workspace_role_new" RENAME TO "workspace_role";
DROP TYPE "public"."workspace_role_old";
ALTER TABLE "memberships" ALTER COLUMN "role" SET DEFAULT 'GUEST';
COMMIT;

-- AlterTable
ALTER TABLE "memberships" ALTER COLUMN "role" SET DEFAULT 'GUEST';

-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "workspaces" ALTER COLUMN "plan" SET DEFAULT 'FREE';
