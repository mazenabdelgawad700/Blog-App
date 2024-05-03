import { Link } from "react-router-dom";

const AdminFeature = ({ feature, count, buttonText, icon }) => {
  return (
    <div className="admin-feature">
      <h3 className="admin-feature-featurename text-capitalize">{feature}</h3>
      <h4 className="admin-feature-count">{count}</h4>
      <div className="admin-feature-icon-wrapper">
        <Link
          to={`/admin-dashboard/${feature}-table`}
          className="btn btn-success"
        >
          {buttonText}
        </Link>
        <i className={`bi bi-${icon}`}></i>
      </div>
    </div>
  );
};

export default AdminFeature;
