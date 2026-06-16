/*
  Warnings:

  - Added the required column `workspace` to the `thresholds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "thresholds" ADD COLUMN     "workspace" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "thresholds" ADD CONSTRAINT "thresholds_workspace_fkey" FOREIGN KEY ("workspace") REFERENCES "workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
