/**
 * Custom error class for expected/operational errors (bad input, not found, etc).
 * `isOperational = true` lets the error middleware tell "safe to show the user"
 * errors apart from unexpected bugs/crashes.
 *
 * Usage: throw new AppError("Job description is required", 400);
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
