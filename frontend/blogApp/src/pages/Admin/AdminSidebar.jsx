import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div className="container admin-sidebar-container">
      <aside className="admin-sidebar">
        <Link to="/admin-dashboard" className="admin-sidebar-title">
          <i className="bi bi-columns"></i>
          Dashboard
        </Link>
        <ul className="admin-sidebar-list">
          <Link
            to="/admin-dashboard/users-table"
            className="admin-sidebar-link"
          >
            <i className="bi bi-person"></i>
            Users
          </Link>
          <Link
            to="/admin-dashboard/posts-table"
            className="admin-sidebar-link"
          >
            <i className="bi bi-file-post"></i>
            Posts
          </Link>
          <Link
            to="/admin-dashboard/categories-table"
            className="admin-sidebar-link"
          >
            <i className="bi bi-tag-fill"></i>
            Categories
          </Link>
          <Link
            to="/admin-dashboard/comments-table"
            className="admin-sidebar-link"
          >
            <i className="bi bi-chat-left-text"></i>
            Comments
          </Link>
        </ul>
      </aside>
    </div>
  );
};

export default AdminSidebar;
