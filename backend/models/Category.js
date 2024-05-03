const mongoose = require("mongoose");
const joi = require("joi");

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
      minLength: 1,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

const validateCreatecategory = (obj) => {
  const schema = joi.object({
    title: joi.string().trim().min(1).required(),
  });
  return schema.validate(obj);
};

module.exports = {
  Category,
  validateCreatecategory,
};
