import { Link } from "react-router-dom";
import "./Post.css";
const PostItem = ({ post, username, userId }) => {
  return (
    <div className="post">
      <div className="post-image-wrapper mb-2 d-flex justify-content-center align-items-center">
        <img
          src={post?.image?.url}
          alt={post?.title}
          className="img-fluid post-item-image"
        />
      </div>

      <div className="post-content px-1">
        <div className="post-info-wrapper mt-1 d-flex justify-content-between align-items-center">
          <div className="post-item-author">
            <strong className="me-1">Author: </strong>
            <Link
              to={`/profile/${post?.user?._id ? post?.user?._id : userId}`}
              className="text-capitalize"
            >
              {post?.user?.username ? post?.user?.username : username}
            </Link>
          </div>

          <p className="post-item-date my-1 fw-bold">
            {new Date(post?.createdAt).toDateString()}
          </p>
        </div>

        <div className="post-item-details d-flex my-2 justify-content-between align-items-center">
          <h4 className="post-item-title mb-0 text-capitalize">
            {post?.title}
          </h4>
          <Link
            className="post-item-category"
            to={`/posts/categories/${post?.category}`}
          >
            {post?.category}
          </Link>
        </div>

        <p className="post-item-description mb-1">
          <span className="me-1">{post?.description}</span>
        </p>
      </div>

      <Link className="post-item-link" to={`/posts/details/${post?._id}`}>
        Read More...
      </Link>
    </div>
  );
};

export default PostItem;
