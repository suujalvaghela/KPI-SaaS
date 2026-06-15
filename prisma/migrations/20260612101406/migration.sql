/*
  Warnings:

  - The values [Owner,Admin,User] on the enum `workspace_role` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[role,resource,action]` on the table `policies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,author]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "workspace_role_new" AS ENUM ('Creator', 'Guest');
ALTER TABLE "public"."memberships" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "memberships" ALTER COLUMN "role" TYPE "workspace_role_new" USING ("role"::text::"workspace_role_new");
ALTER TYPE "workspace_role" RENAME TO "workspace_role_old";
ALTER TYPE "workspace_role_new" RENAME TO "workspace_role";
DROP TYPE "public"."workspace_role_old";
ALTER TABLE "memberships" ALTER COLUMN "role" SET DEFAULT 'Guest';
COMMIT;

-- AlterTable
ALTER TABLE "memberships" ALTER COLUMN "role" SET DEFAULT 'Guest';

-- CreateIndex
CREATE UNIQUE INDEX "policies_role_resource_action_key" ON "policies"("role", "resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_name_author_key" ON "workspaces"("name", "author");
