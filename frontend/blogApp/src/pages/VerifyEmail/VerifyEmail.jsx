import { Link, useParams } from "react-router-dom";
import "./VerifyEmail.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { verifyAccount } from "../../Redux/ApiCalls/authApi";
const VerifyEmail = () => {
  const { userId, token } = useParams();
  const { isEmailVerified } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyAccount(userId, token));
  }, []);

  return (
    <>
      {isEmailVerified ? (
        <section className="verify-email">
          <i className="bi bi-patch-check"></i>
          <h1>Your account has been verified successfully</h1>
          <Link to="/log-in" className="btn btn-dark">
            Login
          </Link>
        </section>
      ) : (
        <section className="verify-email">
          <h1 className="text-danger">Invalid Email</h1>
          <Link to="/register" className="btn btn-dark">
            Register with a valid email
          </Link>
        </section>
      )}
    </>
  );
};

export default VerifyEmail;
