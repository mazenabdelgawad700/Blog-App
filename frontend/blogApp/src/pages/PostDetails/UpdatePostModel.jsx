/* eslint-disable react/prop-types */
import "./UpdatePostModel.css";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updatePost } from "../../Redux/ApiCalls/postApi";
import { getCategories } from "../../Redux/ApiCalls/categoriesApi";

const UpdatePostModel = ({ post, setShowUpdatePostPage }) => {
  const dispatch = useDispatch();
  const { updatePostLoading } = useSelector((state) => state.posts);
  const { categories } = useSelector((state) => state.categories);

  const [title, setTitle] = useState(post?.title);
  const titleRef = useRef(null);

  const [category, setCategory] = useState(post?.category);
  const categoryRef = useRef(null);

  const [description, setDescription] = useState(post?.description);
  const descriptionRef = useRef(null);
  useEffect(() => {
    titleRef.current.focus();
    dispatch(getCategories());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      titleRef?.current?.focus();
      return toast.error("Title is required");
    }
    if (description.trim() === "") {
      descriptionRef?.current?.focus();
      return toast.error("Description is required");
    }
    if (category.trim() === "") {
      categoryRef?.current?.focus();
      return toast.error("Category is required");
    }

    dispatch(updatePost({ title, category, description }, post._id));

    toast.success("Post updated successfully");
    setShowUpdatePostPage(false);
  };

  return (
    <div className="update-post">
      <div className="container">
        <form
          onSubmit={handleSubmit}
          className="update-post-form
					d-flex justify-content-center align-items-center flex-column gap-2
				"
        >
          <abbr title="close">
            <i
              className="bi bi-x-circle-fill"
              onClick={() => setShowUpdatePostPage(false)}
            ></i>
          </abbr>
          <h1 className="text-center text-capitalize">Update Post</h1>
          <input
            type="text"
            name="update-post-title"
            id="update-post-title"
            defaultValue={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="update-post-title-input w-100"
            ref={titleRef}
          />
          <select
            defaultValue={category}
            onChange={(e) => setCategory(e.target.value)}
            name="update-post-category"
            id="update-post-category"
            className="update-post-category-select w-100"
            ref={categoryRef}
          >
            <option value="" disabled>
              Selete category
            </option>
            {categories.map((category) => (
              <option value={category?.title} key={category?._id}>
                {category?.title}
              </option>
            ))}
          </select>
          <textarea
            name="update-post-text-area"
            id="update-post-text-area"
            className="update-post-textarea w-100"
            placeholder="Description"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionRef}
          ></textarea>
          <button className="btn btn-primary" disabled={updatePostLoading}>
            {updatePostLoading ? (
              <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePostModel;