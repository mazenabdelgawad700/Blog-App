import { toast } from "react-toastify";
import { categoryActions } from "../Slice/categoriesSlice";
import request from "../../utils/baseURL";

export function getCategories() {
  return async (dispatch) => {
    try {
      const { data } = await request.get("/api/category");
      dispatch(categoryActions.setCategories(data.data.categories));
    } catch (error) {
      toast.error(error?.response?.error?.message);
    }
  };
}

export function createCategory(category) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request
        .post("/api/category", category, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch(function (error) {
          if (error) toast.error(error?.response?.data?.message);
        });
      toast.success(data?.message);
      dispatch(categoryActions.addCategory(data?.data?.category));
    } catch (error) {
      toast.error(error?.response?.error?.message);
    }
  };
}

// export function createCategory(category) {
//   return async (dispatch) => {
//     try {
//       const token = JSON.parse(localStorage.getItem("user")).token;
//       const { data } = await request.post("/api/category", category, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       //console.log(data?.message);
//       dispatch(categoryActions.addCategory(data.data.category));
//     } catch (error) {
//       console.log(error?.message);
//       toast.error(error?.response?.error?.message);
//     }
//   };
// }

export function deleteCategory(categoryId) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.delete(`/api/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(categoryActions.deleteCategory(data?.categoryId));
      toast.success(data?.message);
    } catch (error) {
      toast.error(error?.response?.error?.message);
    }
  };
}
