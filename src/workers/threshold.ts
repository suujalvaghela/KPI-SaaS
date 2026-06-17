import { Worker } from "bullmq";
import { getThresholdsByMetricDao2 } from "../modules/threshold/threshold.dao.js";
import { createNotificationDto } from "../modules/notification/notification.dao.js";
import 'dotenv/config'
import { redisConnection } from "../config/redis.js";
import { sendEmail } from "../utils/email.js";

const thresholdWorker = new Worker(
    "threshold-check",
    async (job) => {
        const { data: { metric, value, timestamp } } = job

        const thresholds = await getThresholdsByMetricDao2(metric);
        if (!thresholds.length) return

        for (const threshold of thresholds) {
            const breached =
                (threshold.condition === "ABOVE" && Number(value) > Number(threshold.value)) ||
                (threshold.condition === "BELOW" && Number(value) < Number(threshold.value))

            if (breached) {
                const message = `Threshold breached for metric ${metric}: value ${value} is ${threshold.condition} ${threshold.value} at ${timestamp}`;
                await createNotificationDto({ user: threshold.notifyUser, workspace: threshold.workspace, message })
                await sendEmail({
                    to: threshold.notifyUser,
                    subject: "Threshold Alert",
                    text: message
                })
            }
        }
    },
    { connection: redisConnection }
)

thresholdWorker.on("completed", (job) => {
    console.log(`[THRESHOLD-WORKER] Job ${job.id} completed`)
})

thresholdWorker.on("failed", (job, error) => {
    console.error(`[THRESHOLD-WORKER] Job ${job?.id} failed:`, error)
})

export { thresholdWorker }