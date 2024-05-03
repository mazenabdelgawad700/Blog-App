import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import "./Register.css";
import { registerUser } from "../../../Redux/ApiCalls/authApi";
const Register = () => {
  const [userName, setUserName] = useState("");
  const userNameRef = useRef(null);

  const [email, setEmail] = useState("");
  const emailRef = useRef(null);

  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const [confirmPassword, setConfirmPassword] = useState("");
  const confirmPasswordRef = useRef(null);

  const { registerMessage } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName === "") {
      userNameRef.current.focus();
      return toast.error("User Name is required");
    }
    if (email === "") {
      emailRef.current.focus();
      return toast.error("Email is required");
    }
    if (password === "") {
      passwordRef.current.focus();
      return toast.error("Password is required");
    }
    if (confirmPassword === "") {
      confirmPasswordRef.current.focus();
      return toast.error("Please, confirm your password");
    } else if (
      password !== "" &&
      confirmPassword !== "" &&
      password !== confirmPassword
    ) {
      confirmPasswordRef.current.focus();
      return toast.error("Must match the previous password");
    }

    dispatch(registerUser({ username: userName, password, email }));
  };

  if (registerMessage) {
    swal({
      title: registerMessage,
      icon: "success",
    }).then((isOk) => {
      if (isOk) navigate("/log-in");
      else navigate("/");
    });
  }

  return (
    <section className="register">
      <div className="container">
        <h2 className="text-center text-capitalize fw-bold">Create Account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-username">
            <label htmlFor="username">User Name </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              ref={userNameRef}
            />
          </div>

          <div className="register-email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={emailRef}
            />
          </div>

          <div className="register-password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              ref={passwordRef}
            />
          </div>
          <div className="register-confirm-password">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              ref={confirmPasswordRef}
            />
          </div>

          <button className="btn btn-dark" type="submit">
            Register
          </button>
        </form>

        <p className="mt-2 mb-0">
          Have an account? <Link to="/log-in"> Log In</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
