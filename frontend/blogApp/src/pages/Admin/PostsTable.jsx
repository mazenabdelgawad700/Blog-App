import AdminSidebar from "./AdminSidebar";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, getPosts } from "../../Redux/ApiCalls/postApi";
const PostsTable = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getPosts());
  }, []);

  const handleDelete = (postId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this post!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deletePost(postId));
      }
    });
  };

  return (
    <section className="posts-table">
      <AdminSidebar />
      <div className="container">
        <h2 className="posts-table-title text-capitalize">Posts</h2>
        <div className="table-container">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Count</th>
                <th>User</th>
                <th>Post Title</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post, index) => (
                <tr key={post._id}>
                  <td>{index + 1}</td>
                  <td className="text-capitalize">{post.user.username}</td>
                  <td>{post.title}</td>
                  <td className="admin-dashboard-buttons-container">
                    <Link
                      className="btn btn-primary"
                      to={`/posts/details/${post._id}`}
                    >
                      View Post
                    </Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(post?._id)}
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

export default PostsTable;
