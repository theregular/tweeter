import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import useUserInfoListener from "../../userInfo/UserInfoListenerHook";
import { LoginPresenter, LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const { updateUserInfo } = useUserInfoListener();

  const { displayErrorMessage } = useToastListener();

  const listener: LoginView = {
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
  };

  const [presenter] = useState(new LoginPresenter(listener));

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      presenter.doLogin(alias, password, props.originalUrl, rememberMe);
    }
  };

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          onEnter={loginOnEnter}
          setAlias={setAlias}
          setPassword={setPassword}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={presenter.isLoading}
      submit={() =>
        presenter.doLogin(alias, password, props.originalUrl, rememberMe)
      }
    />
  );
};

export default Login;
