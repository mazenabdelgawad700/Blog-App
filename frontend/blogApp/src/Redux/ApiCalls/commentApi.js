import { toast } from "react-toastify";
import { postActions } from "../Slice/postSlice";
import request from "../../utils/baseURL";
import { commentActions } from "../Slice/commentSlice";

export function addComment(newComment) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.post("/api/comments/", newComment, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(postActions.addCommentToPost(data.data.comment));
    } catch (error) {
      toast.error(error?.response?.error?.message);
    }
  };
}

export function getAllComments() {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.get("/api/comments/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(commentActions.setComments(data.data.comments));
    } catch (error) {
      toast.error(error?.response?.error?.message);
    }
  };
}

export function updateComment(newComment, commentId) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.patch(
        `/api/comments/${commentId}`,
        newComment,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data.message);
      dispatch(postActions.updateComment(data.data.comment));
    } catch (error) {
      toast.error(error?.response?.error?.message);
    }
  };
}

export function deleteComment(commentId) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;

      const { data } = await request.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data?.message);
      dispatch(postActions.deleteComment(commentId));
      dispatch(commentActions.deleteComment(commentId));
      //
    } catch (error) {
      toast.error(error?.response?.error?.message);
    }
  };
}
