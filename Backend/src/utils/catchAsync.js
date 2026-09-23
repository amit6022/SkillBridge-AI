/**
 * Wraps an async controller so any thrown error / rejected promise
 * (PDF parse failure, Gemini API timeout, DB error, etc.) is passed to
 * Express's next(err) instead of crashing the process or hanging the request.
 *
 * Usage:
 *   const generateInterviewReportController = catchAsync(async (req, res) => {
 *     ... no try/catch needed here ...
 *   });
 */
function catchAsync(controllerFn) {
  return function (req, res, next) {
    Promise.resolve(controllerFn(req, res, next)).catch(next);
  };
}

module.exports = catchAsync;
