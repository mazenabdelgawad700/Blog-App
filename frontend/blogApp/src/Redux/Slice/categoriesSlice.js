import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "auth",
  initialState: {
    categories: [],
  },
  reducers: {
    setCategories(state, action) {
      state.categories = action.payload;
    },
    deleteCategory(state, action) {
      state.categories = state.categories.filter((category) => {
        return category._id !== action.payload;
      });
    },
    addCategory(state, action) {
      state.categories.push(action.payload);
    },
  },
});

const categoryReducer = categorySlice.reducer;
const categoryActions = categorySlice.actions;
export { categoryReducer, categoryActions };
