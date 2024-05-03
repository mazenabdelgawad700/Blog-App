const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const {
  validateCreatePost,
  validateUpdatePost,
  Post,
} = require("../models/Post");
const {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} = require("../utils/cloudinary");
const { Comment } = require("../models/Comment");
/** ----------------------------------------
 * @desc Create  new post
 * @route /api/posts
 * @method POST
 * @access private (only logged user)
----------------------------------------*/
module.exports.createPostCtrl = asyncHandler(async (req, res, next) => {
  // 1. Validation for image
  if (!req.file)
    return res
      .status(404)
      .json({ status: "Error", message: "no image provided" });

  // 2. Validation for data [title, description, category]
  const { error } = validateCreatePost(req.body);

  if (error)
    return res
      .status(400)
      .json({ status: "Error", message: error.details[0].message });

  // 3. Upload photo
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // send image to cloudinary
  const result = await cloudinaryUploadImage(imagePath);

  // 4. Create new post and save it to DB
  const post = await Post.create({
    ...req.body,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });

  // 5. Remvoe image from server
  fs.unlinkSync(imagePath, (err) => {
    if (err) {
      return res.status(500).json({
        status: "Fail",
        message: err,
      });
    }
    return;
  });

  // 6. Send response to the client
  return res.status(201).json({ status: "Success", data: { post } });
});

/** ----------------------------------------
 * @desc GET all posts
 * @route /api/posts
 * @method GET
 * @access public
----------------------------------------*/
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { page, category } = req.query;
  let posts = [];
  if (+page)
    posts = await Post.find()
      .skip((+page - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .lean()
      .populate("comments")
      .populate("user");
  else if (category)
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .lean()
      .populate("comments")
      .populate("user");
  else
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .lean()
      .populate("comments")
      .populate("user");
  return res.status(200).json({ status: "Success", data: { posts } });
});

/** ----------------------------------------
 * @desc GET Single post
 * @route /api/posts
 * @method GET
 * @access public
----------------------------------------*/
module.exports.getSinglePostCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId)
    .lean()
    .populate("comments")
    .populate("user");

  if (!post)
    return res.status(404).json({ status: "Error", message: "Post not found" });

  return res.status(200).json({ status: "Success", data: { post } });
});

/** ----------------------------------------
 * @desc GET Posts count
 * @route /api/posts/count
 * @method GET
 * @access public 
----------------------------------------*/
module.exports.getPostsCountCtrl = asyncHandler(async (req, res) => {
  const postsCount = await Post.countDocuments();
  return res
    .status(200)
    .json({ status: "Success", data: { count: postsCount } });
});

/** ----------------------------------------
 * @desc Delete Posts 
 * @route /api/posts/:postId
 * @method DELETE
 * @access private (logged user & admin)
----------------------------------------*/
module.exports.deletePostsCtrl = asyncHandler(async (req, res) => {
  // 1 - Get the post
  const post = await Post.findById(req.params.postId);
  if (!post)
    return res.status(404).json({ status: "Error", message: "post not found" });

  // check if user the owner user or admin
  if (req.user.id === post.user.toString() || req.user.isAdmin) {
    // 2 - delete the post image from cloudinary
    await cloudinaryRemoveImage(post.image.publicId);

    // delete all comments that belongs to this post
    await Comment.deleteMany({ postId: post._id });

    // 3 - delete the post from database
    await Post.findByIdAndDelete(req.params.postId);

    // 4 - send response to client
    return res.status(200).json({
      status: "Success",
      message: "post deleted successfully",
      data: { postId: req.params.postId },
    });
  } else
    return res
      .status(403)
      .json({ status: "Fail", message: "unauthorized access" });
});

/** ----------------------------------------
 * @desc update Post 
 * @route /api/posts/:postId
 * @method PATCH
 * @access private (logged user)
----------------------------------------*/
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  // validate values
  const { error } = validateUpdatePost(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "Error", message: error.details[0].message });

  // get the post to update
  const post = await Post.findById(req.params.postId);

  if (!post)
    return res.status(404).json({ status: "Fail", message: "Post not found" });

  // 3. Update post
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $set: {
        ...req.body,
      },
    },
    { new: true }
  )
    .lean()
    .populate("user", { password: false })
    .populate("comments");

  // validate user
  if (req.user.id !== post.user.toString())
    return res
      .status(403)
      .json({ status: "Fail", message: "unauthorized access" });

  return res
    .status(200)
    .json({ status: "Success", data: { post: updatedPost } });
});
/** ----------------------------------------
 * @desc update Post photo
 * @route /api/posts/upload-image/:postId
 * @method PATCH
 * @access private (logged user)
 * ----------------------------------------*/
module.exports.updatePostPhotoCtrl = asyncHandler(async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ statusbar: "Error", message: "No image provided!" });

  const post = await Post.findById(req.params.postId);

  if (!post)
    return res.status(404).json({ status: "Error", message: "Post not found" });

  // validate user
  if (req.user.id !== post.user.toString())
    return res
      .status(403)
      .json({ status: "Fail", message: "unauthorized access" });

  // remove old image from cloudinary
  await cloudinaryRemoveImage(post.image.publicId);

  // Get the image path and upload to cloudinary
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImage(imagePath);

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  )
    .lean()
    .populate("user", { password: false })
    .populate("comments");

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

  return res.status(200).json({
    status: "Success",
    message: "post image changed successfully",
    data: { post: updatedPost },
  });
});

/** ----------------------------------------
 * @desc toggle like button
 * @route /api/posts/like/:postId
 * @method PATCH
 * @access private (logged user)
 * ----------------------------------------*/
module.exports.toggleLikesCtrl = asyncHandler(async (req, res) => {
  const postId = req.params.postId;
  const loggedInUser = req.user.id;
  // Get post from database
  let post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ status: "Error", message: "Post not found" });

  // Check if the user has already liked this post and remove it or add it
  const isPostLiked = post.likes.find(
    (user) => user.toString() === loggedInUser
  );

  if (isPostLiked)
    // remove user id from likes array
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loggedInUser },
      },
      { new: true }
    );
  else {
    // add user id to likes array
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loggedInUser },
      },
      { new: true }
    );
  }

  // Return response
  res.status(200).json({
    status: "Success",
    data: {
      likes: post.likes,
    },
  });
});
