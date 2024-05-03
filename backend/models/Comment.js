const mongoose = require("mongoose");
const joi = require("joi");

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      minLength: 1,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      minLength: 1,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

const validateCreateComment = (obj) => {
  const schema = joi.object({
    postId: joi.string().required().label("Post ID"),
    text: joi.string().trim().min(1).required(),
  });
  return schema.validate(obj);
};

const validateUpdateComment = (obj) => {
  const schema = joi.object({
    text: joi.string().trim().min(1).required(),
  });
  return schema.validate(obj);
};

module.exports = {
  Comment,
  validateCreateComment,
  validateUpdateComment,
};
