const router = require("express").Router();
const {
  createPostCtrl,
  getAllPostsCtrl,
  getSinglePostCtrl,
  getPostsCountCtrl,
  deletePostsCtrl,
  updatePostCtrl,
  updatePostPhotoCtrl,
  toggleLikesCtrl,
} = require("../controllers/postController");
const { verifyToken } = require("../middleware/verifyToken");
const photoUpload = require("../middleware/photoUpload");
const { allowedToAdmin } = require("../middleware/allowedToAdmin");
const validateObjectId = require("../middleware/validateObjectId");
router
  .route("/")
  .post(verifyToken, photoUpload.single("image"), createPostCtrl)
  .get(getAllPostsCtrl);

router.route("/count").get(getPostsCountCtrl);

router
  .route("/:postId")
  .get(validateObjectId, getSinglePostCtrl)
  .delete(validateObjectId, verifyToken, deletePostsCtrl)
  .patch(validateObjectId, verifyToken, updatePostCtrl);

router
  .route("/upload-image/:postId")
  .patch(
    validateObjectId,
    verifyToken,
    photoUpload.single("image"),
    updatePostPhotoCtrl
  );

router
  .route("/like/:postId")
  .patch(validateObjectId, verifyToken, toggleLikesCtrl);

module.exports = router;
