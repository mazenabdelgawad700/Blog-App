import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../../Redux/ApiCalls/passwordApi";
import "./ForgotPassword.css";
const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      emailRef.current.focus();
      return toast.error("Email is required");
    }

    dispatch(forgotPassword(email));
  };

  return (
    <section className="forgot-password">
      <div className="container">
        <h2 className="text-center text-capitalize fw-bold">
          Reset your password
        </h2>

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <div className="forgot-password-email">
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

          <button className="btn btn-dark" type="submit">
            Send Email
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
