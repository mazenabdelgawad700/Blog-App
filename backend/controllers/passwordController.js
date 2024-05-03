const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateEmail, validateNewPassword } = require("../models/User");
const { VerificationToken } = require("../models/VerificationModel");
const crypto = require("crypto");
const sendingMail = require("../utils/sendEmail");

/** ----------------------------------------------
 * @desc Send reset password
 * @route /api/password/reset-password-link
 * @method POST
 * @access public
	----------------------------------------------*/
module.exports.sendResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
  // 1. Validation [new password, email]
  const { error } = validateEmail(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "Error", message: error.details[0].message });

  // 2. Get the user from DB by it's email address
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(404)
      .json({ status: "Error", message: "Email not found" });

  // 3. Create verificationToken and save it to DB
  let verificationToken = await VerificationToken.findOne({ userId: user._id });

  if (!verificationToken) {
    verificationToken = await VerificationToken.create({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    });
    await verificationToken.save();
  }

  // 4. Createing link
  const link = `${process.env.CLIENT_DOMAIN}/reset-password/${user._id}/${verificationToken.token}`;

  // 6. Creating HTML template
  const HTMLTemplate = `<a href="${link}">Click Here To Reset Your Password</a>`;
  // 7. Sending Email
  await sendingMail(user.email, "Reset Password", HTMLTemplate);
  // 8. Sending response to client
  res.status(200).json({
    status: "Success",
    message: "We have sent an email confirmation, please confirm your email",
  });
});

/** ----------------------------------------------
 * @desc Get reset password
 * @route /api/password/reset-password/:userId/:token
 * @method GET
 * @access public
	----------------------------------------------*/
module.exports.getResetPasswordLinkCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user)
    return res.status(404).json({ status: "Error", message: "Invalid Link" });

  const verificationtoken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!verificationtoken)
    return res.status(404).json({ status: "Error", message: "Invalid Link" });

  return res.status(200).json({ status: "Success", message: "Valid Link" });
});

/** ----------------------------------------------
 * @desc reset password
 * @route /api/password/reset-password/:userId/:token
 * @method POST
 * @access public
	----------------------------------------------*/
module.exports.resetPassword = asyncHandler(async (req, res) => {
  // 1. validate the password
  const { error } = validateNewPassword(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "Error", message: error.details[0].message });

  // 2. Get the user from DB by it's email address
  const user = await User.findById(req.params.userId);
  if (!user)
    return res
      .status(404)
      .json({ status: "Error", message: "Invalid Link not found user" });

  // 3. Validate verificationToken
  const verificationtoken = await VerificationToken.findOne({
    userId: user._id,
    token: req.params.token,
  });

  if (!verificationtoken)
    return res
      .status(404)
      .json({ status: "Error", message: "Invalid Link not found token" });

  if (!user.isAccountVerified) {
    user.isAccountVerified = true;
  }

  // 4. Hash the password
  const hasedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hasedPassword;

  await user.save();

  await verificationtoken.deleteOne();

  return res.status(200).json({
    status: "Success",
    message: "Password has been changed successfully",
  });
});
