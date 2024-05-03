const {
  sendResetPasswordLinkCtrl,
  getResetPasswordLinkCtrl,
  resetPassword,
} = require("../controllers/passwordController");
const validateObjectId = require("../middleware/validateObjectId");

const router = require("express").Router();

router.post("/reset-password-link", sendResetPasswordLinkCtrl);

router
  .route("/reset-password/:userId/:token")
  .get(validateObjectId, getResetPasswordLinkCtrl)
  .post(validateObjectId, resetPassword);

module.exports = router;
