/*
  Warnings:

  - A unique constraint covering the columns `[metric,condition,value,notify_user]` on the table `thresholds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "thresholds_metric_condition_value_notify_user_key" ON "thresholds"("metric", "condition", "value", "notify_user");
