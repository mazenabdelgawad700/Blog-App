import { toast } from "react-toastify";
import { authActions } from "../Slice/authSlice";
import request, { BASE_URL } from "../../utils/baseURL";
export function loginUser(user) {
  return async (dispatch) => {
    try {
      const { data } = await request.post("/api/auth/login", user);
      dispatch(authActions.login(data.data));
      localStorage.setItem("user", JSON.stringify(data.data));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function registerUser(user) {
  return async (dispatch) => {
    try {
      const responses = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await responses.json();
      if (data.status === "Success")
        dispatch(authActions.register(data?.message));
      else toast.error(data?.message.replaceAll('"', ""));
    } catch (error) {
      console.log(error?.message);
    }
  };
}

export function verifyAccount(userId, token) {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/${userId}/verify/${token}`
      );
      const data = await response.json();

      if (data.status === "Success") {
        dispatch(authActions.setIsEmailVerified());
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };
}

// export function verifyAccount(userId, token) {
//   return async (dispatch) => {
//     try {
//       await request.get(`/api/auth/${userId}/verify/${token}`);
//       dispatch(authActions.setIsEmailVerified());
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//     }
//   };
// }
