import { toast } from "react-toastify";
import { profileActions } from "../Slice/profileSlice";
import { authActions } from "../Slice/authSlice";
import request from "../../utils/baseURL";

export function getUserProfile(userId) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.get(`/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(profileActions.setProfile(data.data.user));
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
}

export function updateProfilePhoto(newPhoto) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.post(
        `/api/users/profile/profile-photo-upload`,
        newPhoto,
        {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "multipart/form-data",
        }
      );

      toast.success(data.message);
      dispatch(profileActions.setProfilePhoto(data.profilePhoto));
      dispatch(authActions.setUserProfilePhoto(data.profilePhoto));

      const user = JSON.parse(localStorage.getItem("user"));
      user.profilePhoto = data?.profilePhoto;
      localStorage.setItem("user", JSON.stringify(user));

      //
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function updateUserProfile(userId, newProfile) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.patch(
        `/api/users/profile/${userId}`,
        newProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch(profileActions.updateProfile(data?.data?.user));
      dispatch(authActions.setUserName(data?.data?.user?.username));

      const user = JSON.parse(localStorage.getItem("user"));
      // console.log("user from localStorage: ", user);
      user.username = data?.data?.user?.username;
      localStorage.setItem("user", JSON.stringify(user));
      //
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function deleteUserProfile(userId) {
  return async (dispatch) => {
    try {
      dispatch(profileActions.setLoading());
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.delete(`/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data?.message);
      dispatch(profileActions.setIsProfileDeleted());
      dispatch(authActions.logout());
      setTimeout(() => dispatch(profileActions.clearIsProfileDeleted()), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      dispatch(profileActions.clearLoading());
    }
  };
}

export function deleteUserProfileFromAdminSide(userId) {
  return async (dispatch) => {
    try {
      dispatch(profileActions.setLoading());
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.delete(`/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data?.message);
      dispatch(profileActions.setIsProfileDeleted());
      setTimeout(() => dispatch(profileActions.clearIsProfileDeleted()), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      dispatch(profileActions.clearLoading());
    }
  };
}

export function getAllUsers() {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.get(`/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(profileActions.setProfiles(data?.data?.users));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function getUsersCount() {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.get(`/api/users/count/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(profileActions.setUsersCount(data?.data?.count));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}
