import { useEffect } from "react";
import AddCategory from "./AddCategory";
import AdminFeature from "../../components/AdminFeautre/AdminFeature";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../Redux/ApiCalls/categoriesApi";
import { getUsersCount } from "../../Redux/ApiCalls/profileApi";
import { getPostsCount } from "../../Redux/ApiCalls/postApi";
import { getAllComments } from "../../Redux/ApiCalls/commentApi";
const AdminMain = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { usersCount } = useSelector((state) => state.profile);
  const { postsCount } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comment);
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getCategories());
    dispatch(getUsersCount());
    dispatch(getPostsCount());
    dispatch(getAllComments());
  }, []);

  return (
    <div className="admin-main">
      <div className="container">
        <div className="admin-main-features-container">
          <AdminFeature
            feature="users"
            count={usersCount}
            buttonText="see all users"
            icon="person"
          />
          <AdminFeature
            feature="posts"
            count={postsCount}
            buttonText="see all posts"
            icon="file-post"
          />
          <AdminFeature
            feature="categories"
            count={categories?.length}
            buttonText="see all categories"
            icon="tag-fill"
          />
          <AdminFeature
            feature="comments"
            count={comments?.length}
            buttonText="see all comments"
            icon="chat-left-text"
          />
        </div>
        <AddCategory />
      </div>
    </div>
  );
};

export default AdminMain;
