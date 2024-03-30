import { RedisFlushModes, createClient } from "redis";

export const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 16272,
  },
  legacyMode: true,
});

client.on("error", (error) => {
  console.error(error);
});

client.connect();

client.flushAll(RedisFlushModes.ASYNC);