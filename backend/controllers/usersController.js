const asyncHandler = require("express-async-handler");
const { User, validateupdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
  cloudinaryRemoveMultipleImages,
} = require("../utils/cloudinary");
const { Post } = require("../models/Post");
const { Comment } = require("../models/Comment");

/** ----------------------------------------
 * @desc Get all users profile
 * @route /api/users/profile
 * @method GET
 * @access private (only admin)
----------------------------------------*/
module.exports.getUsersProfileCtrl = asyncHandler(async (req, res) => {
  const users = await User.find({}, { __v: false, password: false }).populate(
    "posts"
  );
  return res.status(200).json({ status: "Success", data: { users } });
});

/** ----------------------------------------
 * @desc Get user profile
 * @route /api/users/profile/userId
 * @method GET
 * @access public 
----------------------------------------*/
module.exports.getSingleUserProfileCtrl = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId, {
    __v: false,
    password: false,
    isAdmin: false,
    updatedAt: false,
    isAccountVerified: false,
  }).populate("posts");

  if (!user)
    return res.status(404).json({ status: "Fail", message: "user not found" });

  return res.status(200).json({ status: "Success", data: { user } });
});

/** ----------------------------------------
 * @desc Update user profile
 * @route /api/users/profile/userId
 * @method PATCH
 * @access private (only current user)
----------------------------------------*/
module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateupdateUser(req.body);

  if (error)
    return res
      .status(400)
      .json({ status: "Error", message: error.details[0].message });

  const userId = req.params.userId;

  if (req.body.password)
    req.body.password = await bcrypt.hash(req.body.password, 10);

  const userToUpdate = await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).populate("posts");

  if (userToUpdate)
    return res.status(200).json({
      status: "Success",
      message: "profile updated successfully",
      data: { user: userToUpdate },
    });
  else
    return res
      .status(400)
      .json({ status: "Fail", message: "Failed to update user" });
});

/** ----------------------------------------
 * @desc Get users count
 * @route /api/users/count
 * @method GET
 * @access private (only admin)
----------------------------------------*/
module.exports.getUsersCountCtrl = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  return res
    .status(200)
    .json({ status: "Success", data: { count: usersCount } });
});

/** ----------------------------------------
 * @desc change user profile photo
 * @route /api/users/profile/profile-photo-upload
 * @method POST
 * @access private (only logged user)
----------------------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ statusbar: "Error", message: "No image provided!" });

  // get the image path
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // send image to cloudinary
  const result = await cloudinaryUploadImage(imagePath);

  // get user from db
  const user = await User.findById(req.user.id);

  // delete the image from cloudinary if it exists to update user profile photo
  if (user.profilePhoto.publicId !== null)
    await cloudinaryRemoveImage(user.profilePhoto.publicId);

  // change the user photo details in db
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };

  await user.save();

  // delete image from images folder
  fs.unlinkSync(imagePath, (err) => {
    if (err) {
      return res.status(500).json({
        status: "Fail",
        message: err,
      });
    }
    return;
  });

  // sending response to the client
  return res.status(200).json({
    status: "Success",
    message: "your profile photo has been uploaded successfully",
    profilePhoto: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
});

/** ----------------------------------------
 * @desc Delete user profile
 * @route /api/users/profile/:id
 * @method DELETE
 * @access private (only logged user, admin)
----------------------------------------*/
module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user)
    return res.status(404).json({ status: "Error", message: "User not found" });

  // Get all posts
  const allPosts = await Post.find().populate("comments");

  // Get all user's posts from db
  const posts = await Post?.find({ user: user._id });

  // Get public ids from posts
  const publicIds = posts?.map((post) => post.image.publicId);

  // - Delete all posts's images which is blong to this user
  if (publicIds?.length > 0) await cloudinaryRemoveMultipleImages(publicIds);

  // - Delete user's posts
  await Post.deleteMany({ user: user._id });

  // - Delete user's comments
  await Comment.deleteMany({ user: user._id });

  // Delete user's likes
  for (const post of allPosts) {
    // Filter likes for the current post and remove the user's like
    post.likes = post.likes.filter((like) => like.toString() !== user.id);

    // Update the post in the database
    await Post.updateOne({ _id: post._id }, { likes: post.likes });
  }

  // Delete user's comments
  for (const post of allPosts) {
    // Filter likes for the current post and remove the user's like
    post.comments = post?.comments?.filter(
      (comment) => comment.user !== user.id
    );

    // Update the post in the database
    await Post.updateOne({ _id: post._id }, { comments: post.comments });
  }

  // if user has profile photo => delete it
  if (user.profilePhoto.publicId !== null)
    await cloudinaryRemoveImage(user.profilePhoto.publicId);

  // Delete user himself
  await User.findByIdAndDelete(req.params.userId, {
    new: true,
  });

  return res
    .status(200)
    .json({ status: "Success", message: "profile deleted successfully" });
});
