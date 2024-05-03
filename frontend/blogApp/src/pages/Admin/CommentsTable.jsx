import AdminSidebar from "./AdminSidebar";
import swal from "sweetalert";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, getAllComments } from "../../Redux/ApiCalls/commentApi";
const CommentsTable = () => {
  const dispatch = useDispatch();
  const { comments } = useSelector((state) => state.comment);

  //console.log(comments);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getAllComments());
  }, []);

  // useEffect(() => {}, [isCommentDeleted]);

  const handleDelete = (commentId) => {
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

  return (
    <section className="comments-table">
      <AdminSidebar />
      <div className="container">
        <h2 className="comments-table-title text-capitalize">Comments</h2>
        <div className="table-container">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Count</th>
                <th>User</th>
                <th>Comment</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {comments?.map((comment, index) => (
                <tr key={comment?._id}>
                  <td>{index + 1}</td>
                  <td>{comment?.username}</td>
                  <td>{comment?.text}</td>
                  <td className="admin-dashboard-buttons-container">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(comment?._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default CommentsTable;
