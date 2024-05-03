const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../models/Comment");
const { User } = require("../models/User");

/** ----------------------------------------
 * @desc Create new comment
 * @route /api/comments
 * @method POST
 * @access private (only logged user)
----------------------------------------*/
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);
  if (error)
    return res
      .status(400)
      .json({ status: "Error", message: error.details[0].message });

  const userProfile = await User.findById(req.user.id);

  const comment = await Comment.create({
    ...req.body,
    username: userProfile.username,
    user: userProfile.id,
  });

  return res.status(201).json({ status: "Success", data: { comment } });
});

/** ----------------------------------------
 * @desc Get All Comments
 * @route /api/comments
 * @method GET
 * @access private (only admin) 
----------------------------------------*/
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user");
  return res.status(200).json({ status: "Success", data: { comments } });
});

/** ----------------------------------------
 * @desc update Comment
 * @route /api/comments/:commentId
 * @method PATCH
 * @access private (comment owner) 
----------------------------------------*/
module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error)
    return res
      .status(404)
      .json({ status: "Error", message: error.details[0].message });

  const comment = await Comment.findById(req.params.commentId);
  if (!comment)
    return res
      .status(404)
      .json({ status: "Error", message: "Comment not found" });

  if (req.user.id !== comment.user.toString())
    return res
      .status(403)
      .json({ status: "Fail", message: "unauthorized access" });

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    {
      $set: { ...req.body },
    },
    { new: true }
  );

  return res.status(200).json({
    status: "Sucess",
    data: { comment: updatedComment },
    message: "comment updated successfully",
  });
});

/** ----------------------------------------
 * @desc Delete Comment
 * @route /api/comments/:commentId
 * @method DELETE
 * @access private (only admin and comment owner) 
----------------------------------------*/
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment)
    return res
      .status(404)
      .json({ status: "Error", message: "comment not found" });

  if (req.user.id === comment.user.toString() || req.user.isAdmin) {
    // delete comment from database
    await Comment.findByIdAndDelete(req.params.commentId);

    return res
      .status(200)
      .json({ status: "Success", message: "Comment deleted Successfully" });
  } else {
    return res
      .status(403)
      .json({ status: "Fail", message: "unauthorized access" });
  }
});
