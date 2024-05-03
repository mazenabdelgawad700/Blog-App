const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");
const { VerificationToken } = require("../models/VerificationModel");
const crypto = require("crypto");
const sendingMail = require("../utils/sendEmail");
/** ----------------------------------------------
 * @desc Register new user
 * @route /api/auth/register
 * @method POST
 * @access public
 ----------------------------------------------*/

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "Error", message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });

  if (user)
    return res
      .status(400)
      .json({ status: "Fail", message: "email already used" });

  const hasedPassword = await bcrypt.hash(req.body.password, 10);

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hasedPassword,
  });

  await user.save();

  // Creating new verification token and save it to DB
  const verificationToken = new VerificationToken({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await verificationToken.save();

  // Making the link
  const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;

  // Putting the link into an HTML template
  const htmlTemplate = `
    <div>
      <p>Click on the link blow</p>
      <a href="${link}">Verify</a>
    </div>
  `;

  // Seding email to the user
  await sendingMail(user.email, "Verify your email address", htmlTemplate);

  return res.status(201).json({
    status: "Success",
    data: { user },
    message: `you have been sent an email to ${user.email}, please verify your email address`,
  });
});

/** ----------------------------------------------
 * @desc login user
 * @route /api/auth/login
 * @method POST
 * @access public
----------------------------------------------*/

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "Error", message: error.details[0].message });

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ status: "Fail", message: "Invalid email or password" });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(401).json({ status: "Fail", message: "wrong Password" });

  const token = user.generateAuthToken();

  if (!user.isAccountVerified) {
    let verificationToken = await VerificationToken.findOne({
      userId: user._id,
    });

    if (!verificationToken) {
      verificationToken = new VerificationToken({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await verificationToken.save();
    }

    const link = `${process.env.CLIENT_DOMAIN}/users/${user._id}/verify/${verificationToken.token}`;

    const htmlTemplate = `
    <div>
      <p>Click on the link blow</p>
      <a href="${link}">Verify</a>
    </div>
  `;

    await sendingMail(user.email, "Verify your email address", htmlTemplate);

    return res.status(400).json({
      status: "Error",
      message: `you have been sent an email to ${user.email}, please verify your email address`,
    });
  }

  return res.status(200).json({
    status: "Success",
    data: {
      token,
      id: user._id,
      isAdmin: user.isAdmin,
      profilePhoto: user.profilePhoto,
      username: user.username,
    },
  });
});

/** ----------------------------------------------
 * @desc  Verify user email address
 * @route /api/auth/:userId/verify/:token
 * @method GET
 * @access public
----------------------------------------------*/
module.exports.verifyUserAccountCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res
      .status(400)
      .json({ status: "Fail", message: "Invalid Link user not found" });
  }

  const verificationToken = await VerificationToken.findOne({
    userId: req.params.userId,
  });

  console.log("verificationToken: ", verificationToken);

  if (!verificationToken) {
    return res
      .status(400)
      .json({ status: "Fail", message: "Invalid Link token not found" });
  }

  user.isAccountVerified = true;
  await user.save();

  await verificationToken.deleteOne();

  return res
    .status(200)
    .json({ status: "Success", message: "Your account has been verified" });
});
