const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
// const validateObjectId = require("../middleware/validateObjectId");
const {
  createCommentCtrl,
  getAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
} = require("../controllers/commentsController");
const { allowedToAdmin } = require("../middleware/allowedToAdmin");

router
  .route("/")
  .post(verifyToken, createCommentCtrl)
  .get(verifyToken, allowedToAdmin, getAllCommentsCtrl);

router
  .route("/:commentId")
  .delete(verifyToken, deleteCommentCtrl)
  .patch(verifyToken, updateCommentCtrl);
module.exports = router;
