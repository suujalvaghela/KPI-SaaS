/*
  Warnings:

  - The primary key for the `memberships` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user,workspace]` on the table `memberships` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `memberships` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "memberships" DROP CONSTRAINT "memberships_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "memberships_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_workspace_key" ON "memberships"("user", "workspace");
