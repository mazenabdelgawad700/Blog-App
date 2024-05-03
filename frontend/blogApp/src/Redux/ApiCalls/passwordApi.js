import { toast } from "react-toastify";
import { passwordActions } from "../Slice/passwordSlice";
import request from "../../utils/baseURL";

export function forgotPassword(email) {
  return async () => {
    try {
      const { data } = await request.post("/api/password/reset-password-link", {
        email,
      });
      toast.success(data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function getResetPassword(userId, token) {
  return async (dispatch) => {
    try {
      await request.get(`/api/password/reset-password/${userId}/${token}`);
    } catch (error) {
      //console.log(error);
      dispatch(passwordActions.setIsError());
    }
  };
}

export function resetPassword(user, password) {
  return async () => {
    try {
      const { data } = await request.post(
        `/api/password/reset-password/${user?.userId}/${user?.token}`,
        { password }
      );
      toast.success(data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}
