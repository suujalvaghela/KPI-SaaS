/*
  Warnings:

  - Added the required column `creator` to the `datapoints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "datapoints" ADD COLUMN     "creator" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "datapoints" ADD CONSTRAINT "datapoints_creator_fkey" FOREIGN KEY ("creator") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
