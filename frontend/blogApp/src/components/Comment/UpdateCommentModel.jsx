import "./UpdateCommentModel.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { updateComment } from "../../Redux/ApiCalls/commentApi";
import { useDispatch } from "react-redux";
const UpdateCommentModel = ({ setShowUpdateCommentPage, comment }) => {
  const [text, setText] = useState(comment?.text);
  const textRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    textRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") {
      textRef?.current?.focus();
      return toast.error("Title is required");
    }

    dispatch(updateComment({ text }, comment?._id));

    setShowUpdateCommentPage(false);
  };

  return (
    <div className="update-comment">
      <div className="container">
        <form
          onSubmit={handleSubmit}
          className="update-comment-form
					d-flex justify-content-center align-items-center flex-column gap-2
				"
        >
          <abbr title="close">
            <i
              className="bi bi-x-circle-fill"
              onClick={() => setShowUpdateCommentPage(false)}
            ></i>
          </abbr>
          <h1 className="text-center text-capitalize">Update Comment</h1>
          <input
            type="text"
            name="update-comment-title"
            id="update-comment-title"
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Title"
            className="update-comment-title-input w-100"
            ref={textRef}
          />

          <button className="btn btn-primary">Update Comment</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateCommentModel;
