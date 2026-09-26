const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const aiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window, per user/IP
  //   keyGenerator: (req) => req.user?.id || req.ip,
  keyGenerator: (req) => {
    if (req.userId) {
      return req.userId;
    }

    return ipKeyGenerator(req.ip, 56);
  },
  message: {
    message:
      "Too many requests. Please wait a few minutes before trying again.",
  },
  standardHeaders: true,
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

module.exports = { aiRateLimiter };
