import { createSlice } from "@reduxjs/toolkit";

const passwordSlice = createSlice({
  name: "auth",
  initialState: {
    isError: false,
  },
  reducers: {
    setIsError(state) {
      state.isError = true;
    },
  },
});

const passwordReducer = passwordSlice.reducer;
const passwordActions = passwordSlice.actions;
export { passwordReducer, passwordActions };
