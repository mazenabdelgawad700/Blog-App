import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import {
  getSinglePost,
  toggleLikes,
  uploadPostImage,
  deletePost,
} from "../../Redux/ApiCalls/postApi";
import AddComment from "../../components/Comment/AddComment";
import CommentList from "../../components/Comment/CommentList";
import UpdatePostModel from "./UpdatePostModel";
import "./postDetails.css";

const PostDetails = () => {
  const [file, setFile] = useState(null);
  const [showUpdatePostPage, setShowUpdatePostPage] = useState(false);

  const navigate = useNavigate();
  const { postId } = useParams();
  const dispatch = useDispatch();
  const { post, loading } = useSelector((state) => state.posts);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getSinglePost(postId));
  }, []);

  const handleUploadPhoto = (e) => {
    e.preventDefault();
    if (!file) return toast.error("No image provided");
    const formData = new FormData();
    formData.append("image", file);
    dispatch(uploadPostImage(formData, post._id));
    if (!loading) setFile(null);
  };

  // handle delete post
  const handleDeletePost = () => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this post!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deletePost(post?._id));
        navigate("/");
      }
    });
  };

  return (
    <section className="post-details">
      {showUpdatePostPage && (
        <UpdatePostModel
          setShowUpdatePostPage={setShowUpdatePostPage}
          post={post}
        />
      )}

      <div className="container">
        <div className="post-image-wrapper">
          <img
            src={file ? URL.createObjectURL(file) : post?.image?.url}
            alt={post?.title}
            className="img-fluid post-details-image"
          />
          {user && user?.id === post?.user?._id && (
            <form
              onSubmit={handleUploadPhoto}
              className="update-post-image-form
          "
            >
              <label htmlFor="file">
                <i className="bi bi-image-fill me-1"></i>
                {file ? file?.name : "Select new image"}
              </label>
              <input
                type="file"
                name="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-grow spinner-grow-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  "Upload"
                )}
              </button>
            </form>
          )}
        </div>

        <h1 className="post-details-title">{post?.title}</h1>

        <div className="post-details-info d-flex justify-content-between align-items-center">
          <div className="post-details-user-info d-flex  align-items-center gap-2">
            <img
              src={post?.user?.profilePhoto?.url}
              alt={post?.user?.username}
              className="post-details-user-info-image"
            />

            <div className="post-details-user-info-user d-flex flex-column gap-0">
              <strong className="me-1">
                <Link to={`/profile/${post?.user?._id}`}>
                  {post?.user?.username}
                </Link>
              </strong>
              <span>{post?.createdAt}</span>
            </div>
          </div>

          <h5 className="post-details-category mb-0">
            <Link to={`/posts/categories/${post?.category}`}>
              {post?.category}
            </Link>
          </h5>
        </div>

        <p className="post-details-description">{post?.description}</p>

        <div
          className="post-details-icon-wrapper 
          d-flex justify-content-between align-items-center gap-1
        "
        >
          <div className="post-details-icon-wrapper-likes">
            <i
              onClick={() => {
                if (!user) return toast.error("You must login first");
                dispatch(toggleLikes(post?._id));
              }}
              className={
                post?.likes?.includes(user?.id)
                  ? "bi bi-hand-thumbs-up-fill"
                  : "bi bi-hand-thumbs-up"
              }
            ></i>
            <small className="mx-1">{post?.likes?.length}</small>
            <span>{post?.likes?.length === 1 ? "Like" : "Likes"}</span>
          </div>

          {user && user?.id === post?.user?._id && (
            <div className="post-details-icon-wrapper-update-post">
              <i
                className="bi bi-pencil-square"
                onClick={() => setShowUpdatePostPage(true)}
              ></i>
              <i
                onClick={() => handleDeletePost()}
                className="bi bi-trash-fill"
              ></i>
            </div>
          )}
        </div>

        {/*  COMMENT  SECTION  */}
        {user ? (
          <AddComment postId={post?._id} />
        ) : (
          <p className="fw-bold m-0 mt-2 text-danger">
            To write a commment, log in first!
          </p>
        )}
        <CommentList comments={post?.comments} />
      </div>
    </section>
  );
};

export default PostDetails;
