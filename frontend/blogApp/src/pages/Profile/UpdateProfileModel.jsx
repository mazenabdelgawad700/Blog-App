import "./UpdateProfileModel.css";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../Redux/ApiCalls/profileApi";

const UpdateProrfileModel = ({ setShowUpdateProfilePage, profile }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState(profile?.username);
  const nameRef = useRef(null);

  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  const [description, setDescription] = useState(profile?.bio);
  const descriptionRef = useRef(null);

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = { username: name, bio: description };

    if (password.trim() !== "") {
      updatedUser.password = password;
    }

    dispatch(updateUserProfile(profile.id, updatedUser));

    setShowUpdateProfilePage(false);

    toast.success("Profile updated successfully");
  };

  return (
    <div className="update-profile">
      <div className="container">
        <form
          onSubmit={handleSubmit}
          className="update-profile-form
					d-flex justify-content-center align-items-center flex-column gap-2
				"
        >
          <abbr title="close">
            <i
              className="bi bi-x-circle-fill"
              onClick={() => setShowUpdateProfilePage(false)}
            ></i>
          </abbr>

          <h1 className="text-center text-capitalize">Update Profile</h1>

          <input
            type="text"
            name="update-profile-username"
            id="update-profile-username"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="user name"
            className="update-profile-username-input w-100"
            ref={nameRef}
          />

          <input
            type="password"
            name="update-profile-password"
            id="update-profile-password"
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="update-profile-password-input w-100"
            ref={passwordRef}
          />

          <textarea
            name="update-profile-bio"
            id="update-profile-bio"
            className="update-profile-textarea w-100"
            placeholder="Bio"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
            ref={descriptionRef}
          ></textarea>
          <button className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProrfileModel;
