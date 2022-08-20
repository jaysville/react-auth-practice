import { useContext, useRef } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const newPasswordRef = useRef();

  const authCtx = useContext(AuthContext);

  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredNewPassword = newPasswordRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAGUrThoaeJrZkMgblpCYc2cm_NcuYhebQ",
      {
        method: "Post",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      alert("password changed");
      history.replace("/");
    });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" min="7" ref={newPasswordRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
