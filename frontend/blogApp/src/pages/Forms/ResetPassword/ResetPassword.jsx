import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getResetPassword,
  resetPassword,
} from "../../../Redux/ApiCalls/passwordApi";
import "./ResetPassword.css";
const ResetPassword = () => {
  const dispatch = useDispatch();
  const { isError } = useSelector((state) => state.password);
  const { userId, token } = useParams();

  useEffect(() => {
    dispatch(getResetPassword(userId, token));
  }, [userId, token]);

  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  useEffect(() => {
    passwordRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "") {
      passwordRef.current.focus();
      return toast.error("Password is required");
    }

    dispatch(resetPassword({ userId, token }, password));
  };

  return (
    <section className="forgot-password">
      <div className="container">
        {!isError ? (
          <>
            <h2 className="text-center text-capitalize fw-bold">
              Reset your password
            </h2>

            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="forgot-password-email">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="password Address"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  ref={passwordRef}
                />
              </div>

              <button className="btn btn-dark" type="submit">
                Resest Password
              </button>
            </form>
          </>
        ) : (
          <h2 className="text-center fw-bold text-danger">Not Found</h2>
        )}
      </div>
    </section>
  );
};

export default ResetPassword;
