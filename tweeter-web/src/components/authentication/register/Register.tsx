import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import useToastListener from "../../toaster/ToastListenerHook";
import useUserInfoListener from "../../userInfo/UserInfoListenerHook";
import {
  RegisterPresenter,
  RegisterProfile,
  RegisterView,
} from "../../../presenter/RegisterPresenter";

// interface Props {
//   presenterGenerator: (view: RegisterView) => RegisterPresenter;
// }

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoListener();
  const { displayErrorMessage } = useToastListener();

  const listener: RegisterView = {
    updateUserInfo: updateUserInfo,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
    setImageBytes: setImageBytes,
  };

  const [presenter] = useState(new RegisterPresenter(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !presenter.imageUrl ||
      !presenter.imageFileExtension
    );
  };

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      const userProfile: RegisterProfile = {
        firstName: firstName,
        lastName: lastName,
        alias: alias,
        password: password,
        imageBytes: imageBytes,
        imageFileExtension: presenter.imageFileExtension,
      };
      presenter.doRegister(userProfile, rememberMe);
    }
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>
        <AuthenticationFields
          onEnter={registerOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={(event) => presenter.handleFileChange(event)}
          />
          <label htmlFor="imageFileInput">User Image</label>
          <img src={presenter.imageUrl} className="img-thumbnail" alt=""></img>
        </div>
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={presenter.isLoading}
      submit={() =>
        presenter.doRegister(
          {
            firstName: firstName,
            lastName: lastName,
            alias: alias,
            password: password,
            imageBytes: imageBytes,
            imageFileExtension: presenter.imageFileExtension,
          },
          rememberMe
        )
      }
    />
  );
};

export default Register;
