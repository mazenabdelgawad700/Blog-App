const mongoose = require("mongoose");
const joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      minLength: 5,
      maxLength: 100,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minLength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        publicId: null,
      },
    },
    bio: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "user",
  localField: "_id",
});

function validateRegisterUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100).required(),
    email: joi.string().trim().min(5).email().required(),
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}

function validateLoginUser(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).email().required(),
    password: joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}

function validateupdateUser(obj) {
  const schema = joi.object({
    username: joi.string().trim().min(2).max(100),
    email: joi.string().trim().min(5).email(),
    password: passwordComplexity(),
    bio: joi.string().trim().max(150),
  });
  return schema.validate(obj);
}

function validateEmail(obj) {
  const schema = joi.object({
    email: joi.string().trim().min(5).email().required(),
  });
  return schema.validate(obj);
}

function validateNewPassword(obj) {
  const schema = joi.object({
    password: passwordComplexity().required(),
  });
  return schema.validate(obj);
}

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateupdateUser,
  validateEmail,
  validateNewPassword,
};
