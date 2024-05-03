import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPostsByCategory } from "../../Redux/ApiCalls/postApi.js";
import PostItem from "../../components/posts/PostItem";
import "./PostsByCategory.css";
const PostsByCategory = () => {
  const dispatch = useDispatch();
  const { category } = useParams();
  const { postsByCategory } = useSelector((state) => state.posts);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getPostsByCategory(category));
  }, []);

  return (
    <section className="posts-by-category">
      <div className="container">
        {postsByCategory.length > 0 && (
          <h1 className="text-center text-capitalize mb-3">{category}</h1>
        )}

        {postsByCategory.length > 0 ? (
          postsByCategory.map((post) => <PostItem post={post} key={post._id} />)
        ) : (
          <h1 className="text-center">
            There Is No Posts With{" "}
            <span className="text-danger text-capitalize">{category}</span>{" "}
            Category Yet!
          </h1>
        )}
      </div>
    </section>
  );
};

export default PostsByCategory;
