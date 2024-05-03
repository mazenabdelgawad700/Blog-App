import AdminSidebar from "./AdminSidebar";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUserProfileFromAdminSide,
} from "../../Redux/ApiCalls/profileApi";
const UsersTable = () => {
  const dispatch = useDispatch();
  const { profiles, isProfileDeleted, loading } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [isProfileDeleted]);

  const handleDelete = (userId) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(deleteUserProfileFromAdminSide(userId));
      }
    });
  };

  return (
    <>
      {loading && (
        <section>
          <div
            className="d-flex justify-content-center align-items-center mb-3"
            style={{ height: "calc(100vh - 125px)" }}
          >
            <div
              className="spinner-grow text-primary"
              style={{ width: "3rem", height: "3rem" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </section>
      )}

      {!loading && (
        <section className="users-table">
          <AdminSidebar />
          <div className="container">
            <h2 className="users-table-title text-capitalize">users</h2>
            <div className="table-container">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Count</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {profiles?.map((profile, index) => (
                    <tr key={profile?._id}>
                      <td>{index + 1}</td>
                      <td>{profile?.username}</td>
                      <td>{profile?.email}</td>
                      <td className="admin-dashboard-buttons-container">
                        <Link
                          className="btn btn-success"
                          to={`/profile/${profile?._id}`}
                        >
                          View Proflie
                        </Link>
                        <button
                          disabled={loading}
                          className="btn btn-danger"
                          onClick={() => handleDelete(profile?._id)}
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
      )}
    </>
  );
};

export default UsersTable;
