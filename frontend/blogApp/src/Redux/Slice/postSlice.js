import { createSlice } from "@reduxjs/toolkit";
import { startTransition } from "react";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    postsCount: null,
    postsByCategory: [],
    loading: false,
    isPostCreated: false,
    post: null,
    updatePostLoading: false,
  },
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
    setPostsCount(state, action) {
      state.postsCount = action.payload;
    },
    setPostsCategory(state, action) {
      state.postsByCategory = action.payload;
    },
    setSinglePost(state, action) {
      state.post = action.payload;
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setUpdatePostLoading(state) {
      state.updatePostLoading = true;
    },
    clearUpdatePostLoading(state) {
      state.updatePostLoading = false;
    },
    setIsPostCreated(state) {
      state.isPostCreated = true;
      state.loading = false;
    },
    clearIsPostCreated(state) {
      state.isPostCreated = false;
    },
    setLikes(state, action) {
      state.post.likes = action.payload;
    },
    setPostImage(state, action) {
      state.post.image = action.payload;
    },
    deletePost(state, action) {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    addCommentToPost(state, action) {
      state.post.comments.push(action.payload);
    },
    updateComment(state, action) {
      state.post.comments = state.post.comments.map((comment) => {
        return comment._id === action.payload._id ? action.payload : comment;
      });
    },
    deleteComment(state, action) {
      state.post.comments = state.post.comments.filter(
        (comment) => comment._id !== action.payload
      );
    },
  },
});

const postReducer = postSlice.reducer;
const postActions = postSlice.actions;
export { postReducer, postActions };
