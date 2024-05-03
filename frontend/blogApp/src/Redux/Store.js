import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slice/authSlice";
import { profileReducer } from "./Slice/profileSlice";
import { postReducer } from "./Slice/postSlice";
import { categoryReducer } from "./Slice/categoriesSlice";
import { commentReducer } from "./Slice/commentSlice";
import { passwordReducer } from "./Slice/passwordSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    posts: postReducer,
    categories: categoryReducer,
    comment: commentReducer,
    password: passwordReducer,
  },
});
