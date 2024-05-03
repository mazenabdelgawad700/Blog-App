import { Link } from "react-router-dom";
const NotFoundPage = () => {
  return (
    <section
      className="not-found-page
			d-flex justify-content-center align-items-center flex-column
		"
    >
      <div className="container d-flex justify-content-center align-items-center flex-column">
        <h1>404</h1>
        <h1>Not Found Page</h1>
        <Link to="/" className="fw-bold fs-4 text-danger">
          Visit Our Home Page!
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
