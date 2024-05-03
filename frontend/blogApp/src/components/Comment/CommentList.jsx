import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteComment } from "../../Redux/ApiCalls/commentApi";
import UpdateCommentModel from "./UpdateCommentModel";
import "./CommentList.css";
const CommentList = ({ comments }) => {
  const [showUpdateCommentPage, setShowUpdateCommentPage] = useState(false);
  const [commentToUpdate, setCommentToUpdate] = useState(null);
  const dispatch = useDispatch();
  const handleDeleteComment = (commentId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this comment!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteComment(commentId));
      }
    });
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpdateComment = (comment) => {
    setCommentToUpdate(comment);
    setShowUpdateCommentPage(true);
  };

  return (
    <div className="comments-list">
      {showUpdateCommentPage && (
        <UpdateCommentModel
          comment={commentToUpdate}
          setShowUpdateCommentPage={setShowUpdateCommentPage}
        />
      )}

      <h4 className="comments-list-count">
        {comments?.length > 1
          ? `${comments?.length || "No"} comments`
          : `${comments?.length || "No"} comment`}
      </h4>
      {comments?.length > 0 ? (
        comments?.map((comment) => (
          <div className="comments-list-item" key={comment?._id}>
            <div
              className="comments-list-item-user-info
						d-flex justify-content-between align-items-end
					"
            >
              <h2 className="m-0 comments-list-item-user-info-username">
                <Link to={`/profile/${comment?.user}`}>
                  {comment?.username}
                </Link>
              </h2>
              <p className="comments-list-item-user-info-time m-0">
                {new Date(comment?.createdAt).toDateString()}
              </p>
            </div>

            <p className="comments-list-item-text">{comment?.text}</p>

            {user && user?.id === comment?.user && (
              <div className="comments-list-item-icon-wrapper">
                <i
                  className="bi bi-pencil-square"
                  onClick={() => handleUpdateComment(comment)}
                ></i>
                <i
                  onClick={() => handleDeleteComment(comment?._id)}
                  className="bi bi-trash-fill"
                ></i>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet, be the first </p>
      )}
    </div>
  );
};

export default CommentList;
