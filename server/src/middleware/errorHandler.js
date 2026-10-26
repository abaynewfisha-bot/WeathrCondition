module.exports = (error, req, res, next) => {
  console.error(error.message);

  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;

  res.status(status).json({
    error:
      status === 404
        ? error.message
        : status >= 500
          ? "Server error. Please try again later."
          : error.message
  });
};
