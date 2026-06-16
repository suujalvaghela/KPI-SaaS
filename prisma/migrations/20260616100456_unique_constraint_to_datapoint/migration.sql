/*
  Warnings:

  - A unique constraint covering the columns `[metric,value,timestamp,creator]` on the table `datapoints` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "datapoints_metric_value_timestamp_creator_key" ON "datapoints"("metric", "value", "timestamp", "creator");
