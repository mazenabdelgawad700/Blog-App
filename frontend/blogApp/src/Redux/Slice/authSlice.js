import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    registerMessage: null,
    isEmailVerified: false,
  },
  reducers: {
    login(state, action) {
      state.user = action.payload;
      state.registerMessage = null;
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
    },
    register(state, action) {
      state.registerMessage = action.payload;
    },
    setUserProfilePhoto(state, action) {
      state.user.profilePhoto = action.payload;
    },
    setUserName(state, action) {
      state.user.username = action.payload;
    },
    setIsEmailVerified(state) {
      state.isEmailVerified = true;
      state.registerMessage = null;
    },
  },
});

const authReducer = authSlice.reducer;
const authActions = authSlice.actions;
export { authReducer, authActions };
