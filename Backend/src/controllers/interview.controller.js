const { PDFParse } = require("pdf-parse");
const {
  generateInterviewReport,
  generateResumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { redisClient } = require("../config/redis");
const { buildReportCacheKey } = require("../utils/cacheKey");

const REPORT_CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours

/**
 * @descrition This controller is responsible for generating interview report on the basis of user self description, resume pdf and job description.
 * Validation (jobDescription present, resume-or-selfDescription present) already
 * happened in validateGenerateReport middleware before this runs.
 */

const generateInterviewReportController = catchAsync(async (req, res) => {
  let resumeText = "";
  if (req.file) {
    const resumeContent = await new PDFParse(
      Uint8Array.from(req.file.buffer),
    ).getText();
    resumeText = resumeContent.text;
  }

  const { selfDescription, jobDescription } = req.body;

  const cacheKey = buildReportCacheKey({
    resume: resumeText,
    selfDescription,
    jobDescription,
  });

  let interviewReportByAi = null;

  // 1. Try the cache first
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      interviewReportByAi = JSON.parse(cached);
    }
  } catch (err) {
    console.error("Redis read failed, falling back to Gemini:", err.message);
  }

  // 2. Cache miss (or Redis unavailable) - call Gemini for real
  if (!interviewReportByAi) {
    interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    if (!interviewReportByAi) {
      throw new AppError(
        "Could not generate interview report right now. Please try again.",
        502,
      );
    }

    // 3. Save to cache for next time
    try {
      await redisClient.set(cacheKey, JSON.stringify(interviewReportByAi), {
        EX: REPORT_CACHE_TTL_SECONDS,
      });
    } catch (err) {
      console.error("Redis write failed:", err.message);
    }
  }

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeText,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    message: "Interview Report generated succesfully.",
    interviewReport,
  });
});

/**
 * @descrition Controller to get the interview report by interviewId.
 */
const getInterviewReportByIdController = catchAsync(async (req, res) => {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    throw new AppError("Interview report not found.", 404);
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
});

/**
 * @description Controller to get all the interview report s of logged in user.
 */
const getAllInterviewReportController = catchAsync(async (req, res) => {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );

  res.status(200).json({
    message: "Interview reports fetched successfully.",
    interviewReports,
  });
});

/**
 * @description Controller to generate resume pdf based on user self description, resume and job description.
 */
const generateResumePdfController = catchAsync(async (req, res) => {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findById(interviewId);

  if (!interviewReport) {
    throw new AppError("Interview not found", 404);
  }

  const { resume, selfDescription, jobDescription } = interviewReport;

  const pdfBuffer = await generateResumePdf({
    resume,
    selfDescription,
    jobDescription,
  });

  if (!pdfBuffer) {
    throw new AppError("Could not generate resume PDF. Please try again.", 502);
  }

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment, filename=resume_${interviewId}.pdf`,
  });

  res.send(pdfBuffer);
});

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportController,
  generateResumePdfController,
};
