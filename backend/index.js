const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
const authRouter = require("./routes/authRouter");
const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");
const commentsRouter = require("./routes/commentsRouter");
const categoryRouter = require("./routes/categoryRouter");
const passwordRouter = require("./routes/passwordRouter");
const { errorHandler } = require("./middleware/errorHandler");
const app = express();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Server Started");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error.message);
  });

app.use(express.json());
// https://blog-app-1whq.vercel.app
/**
 * {
    origin: "https://blog-app-api-seven.vercel.app/",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }
 */

app.use(cors());

// Prevent the server from XSS attacks
app.use(xss());

app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 200,
  })
);
app.use(helmet());
app.use(hpp());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/category", categoryRouter);
app.use("/api/password", passwordRouter);

app.use(errorHandler);

app.all("*", (req, res) => {
  return res
    .status(404)
    .json({ status: "Error", message: `404 ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
