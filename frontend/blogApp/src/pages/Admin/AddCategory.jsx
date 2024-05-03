import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createCategory } from "../../Redux/ApiCalls/categoriesApi";
const AddCategory = () => {
  const [category, setCategory] = useState("");
  const categoryRef = useRef(null);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (category === "") {
      categoryRef.current.focus();
      return toast.error("Please, add a category");
    }

    dispatch(createCategory({ title: category }));
    setCategory("");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="admin-add-category">
      <h3 className="admin-add-category-title text-capitalize">
        add new category
      </h3>
      <form className="admin-add-category-form" onSubmit={handleSubmit}>
        <label htmlFor="add-category">Category title</label>
        <input
          type="text"
          name="add-category"
          id="add-category"
          placeholder="Enter category title"
          ref={categoryRef}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button className="btn btn-success w-100" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
