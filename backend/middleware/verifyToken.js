const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;

  if (authToken) {
    const token = authToken.split(" ")[1];

    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = decodedPayload;
      next();
    } catch (error) {
      res.status(401).json({ status: "Error", message: error.message });
    }
  } else
    res.status(401).json({ status: "Error", message: "token is required" });
}

function verifyTokenAndOnlyUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.userId)
      return res
        .status(403)
        .json({ status: "Fail", message: "unauthorized access" });
    next();
  });
}

function verifyTokenUserOrAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id !== req.params.userId && req.user.isAdmin === false)
      return res
        .status(403)
        .json({ status: "Fail", message: "unauthorized access" });
    next();
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndOnlyUser,
  verifyTokenUserOrAdmin,
};
