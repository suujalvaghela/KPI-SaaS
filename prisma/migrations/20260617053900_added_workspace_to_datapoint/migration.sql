/*
  Warnings:

  - Added the required column `workspace` to the `datapoints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "datapoints" ADD COLUMN     "workspace" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "datapoints" ADD CONSTRAINT "datapoints_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
