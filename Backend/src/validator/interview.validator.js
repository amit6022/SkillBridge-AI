const { z } = require("zod");
const AppError = require("../utils/AppError");

// jobDescription is always required (matches the "Required" badge in Home.jsx).
// selfDescription is optional here because the frontend lets the user upload
// a resume INSTEAD of typing a self description - we check that "either/or"
// rule separately below, since it depends on req.file too (multer), not just req.body.
const generateReportSchema = z.object({
  jobDescription: z
    .string({ required_error: "Job description is required." })
    .trim()
    .min(20, "Job description is too short to analyze.")
    .max(5000, "Job description must be under 5000 characters."),
  selfDescription: z
    .string()
    .trim()
    .max(2000, "Self description must be under 2000 characters.")
    .optional()
    .or(z.literal("")),
});

/**
 * Runs BEFORE generateInterviewReportController, so we fail fast on bad input
 * instead of paying for a pdf-parse + Gemini API call that would fail anyway.
 */
function validateGenerateReport(req, res, next) {
  const result = generateReportSchema.safeParse(req.body);

  if (!result.success) {
    const firstIssue = result.error.issues[0];
    return next(new AppError(firstIssue.message, 400));
  }

  // Keep the parsed/trimmed values instead of the raw body.
  req.body = result.data;

  const hasResume = Boolean(req.file);
  const hasSelfDescription = Boolean(req.body.selfDescription);

  if (!hasResume && !hasSelfDescription) {
    return next(
      new AppError(
        "Please upload a resume or provide a self description.",
        400,
      ),
    );
  }

  next();
}

module.exports = { validateGenerateReport };
