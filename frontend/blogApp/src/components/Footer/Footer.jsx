import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="" style={styles}>
      <div className="container d-flex justify-content-between align-items-center">
        <p className="mb-0">
          Made By Mazen Abdelgowad &copy; {new Date().getFullYear()}
        </p>
        <p className="mb-0 text-light">
          <NavLink
            target="_blank"
            className="mx-1 text-light"
            to="https://www.linkedin.com/in/mazen-abdel-algowad-609b99254"
          >
            <i className="bi bi-linkedin"></i>
          </NavLink>
          <NavLink
            target="_blank"
            className="mx-1 text-light"
            to="https://github.com/mazenabdelgowad"
          >
            <i className="bi bi-github"></i>
          </NavLink>
        </p>
      </div>
    </footer>
  );
};

const styles = {
  backgroundColor: "#000",
  padding: "20px 0",
  color: "var(--white-color)",
};

export default Footer;
