import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./logIn.css";
import { loginUser } from "../../../Redux/ApiCalls/authApi";
import { useDispatch } from "react-redux";
const Login = () => {
  const [email, setEmail] = useState("");
  const emailRef = useRef(null);
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const disptch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      emailRef.current.focus();
      return toast.error("Email is required");
    }
    if (password === "") {
      passwordRef.current.focus();
      return toast.error("Password is required");
    }

    const user = { email, password };

    disptch(loginUser(user));
  };

  return (
    <section className="log-in">
      <div className="container">
        <h2 className="text-center text-capitalize fw-bold">Welcome back</h2>
        <form className="log-in-form" onSubmit={handleSubmit}>
          <div className="log-in-email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              ref={emailRef}
            />
          </div>
          <div className="log-in-password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              ref={passwordRef}
            />
          </div>

          <button className="btn btn-dark" type="submit">
            Log In
          </button>
        </form>

        <div className="log-in-instructions-wrapper mt-2">
          <p className="mt-1 mb-0">
            Do not have an account? <Link to="/register"> Register</Link>
          </p>
          <p className="mt-1 mb-0">
            Did you forget your password?
            <Link to="/forgot-password"> Forgot your password</Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
