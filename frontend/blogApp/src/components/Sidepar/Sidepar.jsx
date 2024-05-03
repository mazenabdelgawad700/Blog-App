import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCategories } from "../../Redux/ApiCalls/categoriesApi";
import "./Sidepar.css";

const Sidepar = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  return (
    <aside className="categories">
      <h2 className="categories-title text-center">CATEGORIES</h2>
      <ul className="categories-links">
        {categories?.map((category) => (
          <li key={category?._id}>
            <Link
              to={`/posts/categories/${category?.title}`}
              className="category-link text-capitalize"
            >
              {category?.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidepar;
