import PostItem from "./PostItem";
import "./Posts.css";
const PostList = ({ posts }) => {
  return (
    <div className="posts">
      {posts?.map((post) => (
        <PostItem post={post} key={post._id} />
      ))}
    </div>
  );
};

export default PostList;
