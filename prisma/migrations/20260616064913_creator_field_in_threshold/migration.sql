/*
  Warnings:

  - Added the required column `created_by` to the `thresholds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "thresholds" ADD COLUMN     "created_by" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "thresholds" ADD CONSTRAINT "thresholds_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
