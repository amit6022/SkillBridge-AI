const crypto = require("crypto");

/**
 * Builds a stable cache key from the exact inputs that affect the AI's
 * output. Same resume text + same job description + same self description
 * = same key = we can reuse the cached result instead of paying for
 * another Gemini API call.
 */
function buildReportCacheKey({ resume, selfDescription, jobDescription }) {
  const raw = `${resume || ""}|${selfDescription || ""}|${jobDescription || ""}`;
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return `interview-report:${hash}`;
}

module.exports = { buildReportCacheKey };
