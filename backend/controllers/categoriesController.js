const asyncHandler = require("express-async-handler");
const { Category, validateCreatecategory } = require("../models/Category");

/** ----------------------------------------
 * @desc Create new category
 * @route /api/category
 * @method POST
 * @access private (only admin)
----------------------------------------*/
module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreatecategory(req.body);
  if (error)
    return res
      .status(404)
      .json({ status: "Error", message: error.details[0].message });

  const oldCategory = await Category.findOne({ title: req.body.title });

  if (oldCategory)
    return res
      .status(400)
      .json({ status: "Error", message: "Category already exists" });

  const category = await Category.create({ ...req.body, user: req.user.id });

  return res.status(201).json({
    status: "Success",
    data: { category },
    message: "Category created successfully",
  });
});

/** ----------------------------------------
 * @desc Get All Categories
 * @route /api/category
 * @method GET
 * @access public
----------------------------------------*/
module.exports.getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  return res
    .status(200)
    .json({ status: "Success", data: { categories: categories } });
});
/** ----------------------------------------
 * @desc delete Category
 * @route /api/category/:categoryId
 * @method DELETE
 * @access private (only admin)
----------------------------------------*/
module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category)
    return res
      .status(404)
      .json({ status: "Error", message: "Category not found" });

  await Category.findByIdAndDelete(req.params.categoryId);

  return res.status(200).json({
    status: "Success",
    message: "Category deleted successfully",
    categoryId: req.params.categoryId,
  });
});
