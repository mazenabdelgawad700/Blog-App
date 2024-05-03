const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.log(err.message);
  res
    .status(statusCode)
    .json({ message: err.message || "Internal server error" });
};

module.exports = { errorHandler };
