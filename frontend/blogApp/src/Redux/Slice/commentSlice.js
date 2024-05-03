import { createSlice } from "@reduxjs/toolkit";

const commentSlice = createSlice({
  name: "post",
  initialState: {
    comments: [],
  },
  reducers: {
    setComments(state, action) {
      state.comments = action.payload;
    },
    deleteComment(state, action) {
      state.comments = state.comments.filter(
        (comment) => comment._id !== action.payload
      );
    },
  },
});

const commentReducer = commentSlice.reducer;
const commentActions = commentSlice.actions;
export { commentReducer, commentActions };
