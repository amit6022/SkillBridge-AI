/**
 * Centralized error handler. Must be registered LAST in app.js, after all routes.
 * Every controller error (thrown AppError, Mongoose error, Gemini API failure,
 * pdf-parse failure, anything passed to next(err)) ends up here instead of
 * crashing the server or leaking a raw stack trace to the client.
 */
function errorMiddleware(err, req, res, next) {
  console.error(err);

  // Mongoose "CastError" happens when someone passes a malformed id in the URL,
  // e.g. GET /api/interview/report/123 instead of a real ObjectId.
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid id format.",
    });
  }

  // Multer file-upload errors (wrong file type, file too large, etc.)
  if (err.name === "MulterError") {
    return res.status(400).json({
      message: `File upload error: ${err.message}`,
    });
  }

  // Our own AppError instances already know their status code.
  const statusCode = err.statusCode || 500;

  // Never leak internal error details (DB connection strings, stack traces,
  // raw Gemini API error bodies) for unexpected 500s.
  const message =
    err.isOperational || statusCode < 500
      ? err.message
      : "Something went wrong. Please try again.";

  res.status(statusCode).json({ message });
}

module.exports = errorMiddleware;
