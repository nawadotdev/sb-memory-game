import { createClient } from "redis";

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST;

const redisClient = createClient({
  username: "default",
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: 14679,
    reconnectStrategy: (retries) => {
      const delay = Math.min(retries * 1000, 30000);
      return delay;
    },
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export const getRedisClient = async () => {
  if (!REDIS_PASSWORD || !REDIS_HOST) {
    throw new Error("REDIS_PASSWORD or REDIS_HOST is not set");
  }

  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
};
