import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import {
  AdminDashboard,
  CreatePost,
  Login,
  Posts,
  Register,
  Home,
  PostDetails,
  PostsByCategory,
  UsersTable,
  PostsTable,
  Profile,
  CommentsTable,
  CategoriesTable,
  ForgotPassword,
  ResetPassword,
} from "./pages";
import Footer from "./components/Footer/Footer";
import { ToastContainer } from "react-toastify";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import { useSelector } from "react-redux";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail";
function App() {
  const user = useSelector((state) => state.auth.user);
  return (
    <>
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        draggable
        theme="dark"
      />
      <Routes>
        <Route index element={<Home />} />

        <Route path="posts">
          <Route index element={<Posts />} />
          <Route
            path="create-post"
            element={user ? <CreatePost /> : <Navigate to="/" />}
          />
          <Route path="details/:postId" element={<PostDetails />} />
          <Route path="categories/:category" element={<PostsByCategory />} />
        </Route>

        <Route path="admin-dashboard">
          <Route
            index
            element={
              user && user.isAdmin ? <AdminDashboard /> : <Navigate to="/" />
            }
          />
          <Route
            path="users-table"
            element={
              user && user.isAdmin ? <UsersTable /> : <Navigate to="/" />
            }
          />
          <Route
            path="posts-table"
            element={
              user && user.isAdmin ? <PostsTable /> : <Navigate to="/" />
            }
          />
          <Route
            path="comments-table"
            element={
              user && user.isAdmin ? <CommentsTable /> : <Navigate to="/" />
            }
          />
          <Route
            path="categories-table"
            element={
              user && user.isAdmin ? <CategoriesTable /> : <Navigate to="/" />
            }
          />
        </Route>

        <Route
          path="/log-in"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/forgot-password"
          element={!user ? <ForgotPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/reset-password/:userId/:token"
          element={!user ? <ResetPassword /> : <Navigate to="/" />}
        />

        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/users/:userId/verify/:token"
          element={!user ? <VerifyEmail /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:userId"
          element={user ? <Profile /> : <Navigate to="/" />}
        />

        {/* Not Found Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
