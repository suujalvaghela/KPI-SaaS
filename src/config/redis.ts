import { Redis } from 'ioredis'
import 'dotenv/config'

export const redisConnection = new Redis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: null
})

redisConnection.on("connect", () => {
    console.log("Redis connected");
})

redisConnection.on("error", (error) => {
    console.error(`redis connection error: ${error}`);
})