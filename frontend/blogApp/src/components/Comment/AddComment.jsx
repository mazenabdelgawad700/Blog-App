import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addComment } from "../../Redux/ApiCalls/commentApi";
import "./AddComment.css";
const AddComment = ({ postId }) => {
  const [text, setText] = useState("");
  const textRef = useRef(null);

  const dispatch = useDispatch();

  const handleSumbit = (e) => {
    e.preventDefault();

    if (!text.trim()) {
      textRef.current.focus();
      return toast.error("Comment is required");
    }
    dispatch(addComment({ text, postId }));
    setText("");
  };
  return (
    <form className="add-comment-form" onSubmit={handleSumbit}>
      <input
        type="text"
        placeholder="Add comment"
        name="comment"
        id="name"
        autoComplete="off"
        value={text}
        onChange={(e) => setText(e.target.value)}
        ref={textRef}
      />
      <button type="submit" className="btn btn-dark rounded-pill">
        Add comment
      </button>
    </form>
  );
};

export default AddComment;
