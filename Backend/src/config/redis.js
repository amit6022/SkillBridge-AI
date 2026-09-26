const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Caching is a performance optimization, not a critical dependency -
// if Redis is down or misconfigured, we log it and keep the app running
// (every request just falls back to calling Gemini directly).
redisClient.on("error", (err) => {
  console.error("Redis client error:", err.message);
});

let isConnected = false;

async function connectRedis() {
  if (isConnected) return;
  try {
    await redisClient.connect();
    isConnected = true;
    console.log("Redis connected");
  } catch (err) {
    console.error("Could not connect to Redis, caching disabled:", err.message);
  }
}

module.exports = { redisClient, connectRedis };
