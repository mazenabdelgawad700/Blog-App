const mongoose = require("mongoose");

module.exports = (req, res, next) => {
  if (
    !mongoose.Types.ObjectId.isValid(
      req.params.userId || req.params.postId || req.params.categoryId
    )
  )
    return res.status(400).send({ error: "Invalid ID" });

  next();
};
