import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNewPost } from "../../Redux/ApiCalls/postApi.js";
import "./CreatePost.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCategories } from "../../Redux/ApiCalls/categoriesApi.js";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { loading, isPostCreated } = useSelector((state) => state.posts);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getCategories());
  }, []);

  const [title, setTitle] = useState("");
  const titleRef = useRef();

  const [category, setCategory] = useState("");
  const categoryRef = useRef();

  const [description, setDescription] = useState("");
  const descriptionRef = useRef();

  const [file, setFile] = useState(null);
  const fileRef = useRef();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form Validation
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
    if (!file) {
      fileRef?.current?.focus();
      return toast.error("File is required");
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    dispatch(createNewPost(formData));
  };

  if (isPostCreated) navigate("/");

  return (
    <section className="create-post">
      <div className="container">
        <h1>Create Post</h1>
        <form
          onSubmit={handleSubmit}
          className="create-post-form d-flex flex-column justify-content-center align-items-center gap-3"
        >
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title"
            autoComplete="on"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            ref={titleRef}
          />

          <select
            name="category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            ref={categoryRef}
          >
            <option value="Category" disabled>
              Select Category
            </option>
            {categories.map((category) => (
              <option value={category?.title} key={category?._id}>
                {category?.title}
              </option>
            ))}
          </select>

          <textarea
            name="post-description"
            id="post-description"
            className="create-post-textarea"
            autoComplete="on"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionRef}
          ></textarea>
          <input
            type="file"
            name="post-image"
            id="post-image"
            className="create-post-image"
            onChange={(e) => setFile(e.target.files[0])}
            ref={fileRef}
          />
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Create"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
