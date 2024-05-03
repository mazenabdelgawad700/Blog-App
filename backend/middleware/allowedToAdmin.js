function allowedToAdmin(req, res, next) {
  if (!req.user.isAdmin)
    return res
      .status(403)
      .json({ success: "Fail", message: "Unauthorized access" });
  next();
}

module.exports = {
  allowedToAdmin,
};
