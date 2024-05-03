import { toast } from "react-toastify";
import { postActions } from "../Slice/postSlice";
import request from "../../utils/baseURL";

export function createNewPost(post) {
  return async (dispatch) => {
    try {
      dispatch(postActions.setLoading());
      const token = JSON.parse(localStorage.getItem("user")).token;
      await request.post(`/api/posts`, post, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(postActions.setIsPostCreated());
      setTimeout(() => dispatch(postActions.clearIsPostCreated()), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      dispatch(postActions.clearLoading());
    }
  };
}

export function getPosts(page) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?page=${page}`);
      dispatch(postActions.setPosts(data.data.posts));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function getPostsCount() {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.get(`/api/posts/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(postActions.setPostsCount(data?.data?.count));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function getPostsByCategory(category) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts?category=${category}`);
      dispatch(postActions.setPostsCategory(data.data.posts));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function getSinglePost(postId) {
  return async (dispatch) => {
    try {
      const { data } = await request.get(`/api/posts/${postId}`);
      dispatch(postActions.setSinglePost(data.data.post));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function uploadPostImage(newImage, postId) {
  return async (dispatch) => {
    try {
      dispatch(postActions.setLoading());
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.patch(
        `/api/posts/upload-image/${postId}`,
        newImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(data.message);
      dispatch(postActions.setPostImage(data?.data?.post?.image));
      dispatch(postActions.clearLoading());
    } catch (error) {
      toast.error(error?.response?.data?.message);
      dispatch(postActions.clearLoading());
    }
  };
}

export function updatePost(newData, postId) {
  return async (dispatch) => {
    try {
      dispatch(postActions.setUpdatePostLoading());
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.patch(`/api/posts/${postId}`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(data.message);
      dispatch(postActions.setSinglePost(data?.data?.post));
      dispatch(postActions.clearUpdatePostLoading());
    } catch (error) {
      toast.error(error?.response?.data?.message);
      dispatch(postActions.clearUpdatePostLoading());
    }
  };
}

export function deletePost(postId) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(postActions.deletePost(data.data.postId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}

export function toggleLikes(postId) {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("user")).token;
      const { data } = await request.patch(
        `/api/posts/like/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(postActions.setLikes(data.data.likes));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
}
