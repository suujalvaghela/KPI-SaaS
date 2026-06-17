/*
  Warnings:

  - You are about to drop the column `workspace` on the `datapoints` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "datapoints" DROP CONSTRAINT "datapoints_workspace_fkey";

-- AlterTable
ALTER TABLE "datapoints" DROP COLUMN "workspace";
