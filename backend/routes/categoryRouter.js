const router = require("express").Router();
const {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  deleteCategoryCtrl,
} = require("../controllers/categoriesController");
const { verifyToken } = require("../middleware/verifyToken");
const { allowedToAdmin } = require("../middleware/allowedToAdmin");
const validateObjectId = require("../middleware/validateObjectId");

router
  .route("/")
  .post(verifyToken, allowedToAdmin, createCategoryCtrl)
  .get(getAllCategoriesCtrl);

router
  .route("/:categoryId")
  .delete(validateObjectId, verifyToken, allowedToAdmin, deleteCategoryCtrl);

module.exports = router;
