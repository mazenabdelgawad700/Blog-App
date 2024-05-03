const router = require("express").Router();
const {
  getUsersProfileCtrl,
  getSingleUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
} = require("../controllers/usersController");
const { allowedToAdmin } = require("../middleware/allowedToAdmin");
const {
  verifyToken,
  verifyTokenAndOnlyUser,
  verifyTokenUserOrAdmin,
} = require("../middleware/verifyToken");
const validateObjectId = require("../middleware/validateObjectId");
const photoUpload = require("../middleware/photoUpload");

router.route("/profile").get(verifyToken, allowedToAdmin, getUsersProfileCtrl);

router
  .route("/profile/:userId")
  .get(verifyToken, validateObjectId, getSingleUserProfileCtrl)
  .patch(validateObjectId, verifyTokenAndOnlyUser, updateUserProfileCtrl)
  .delete(validateObjectId, verifyTokenUserOrAdmin, deleteUserProfileCtrl);

router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoUpload.single("image"), profilePhotoUploadCtrl);

router.route("/count").get(verifyToken, allowedToAdmin, getUsersCountCtrl);

module.exports = router;
