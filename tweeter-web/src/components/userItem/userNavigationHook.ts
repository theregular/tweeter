import { AuthToken, FakeData, User } from "tweeter-shared";
import useUserInfo from "../userInfo/UserInfoHook";
import useToastListener from "../toaster/ToastListenerHook";
import { UserNavigationPresenter } from "../../presenter/UserNavigationPresenter";

// interface UserNavigation {
//   navigateToUser: (event: React.MouseEvent) => Promise<void>;
// }

const useUserNavigate = () => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener = {
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  };
  const presenter = new UserNavigationPresenter(listener);

  const navigateToUser = (event: React.MouseEvent) =>
    presenter.navigateToUser(authToken!, currentUser!, event);

  return navigateToUser;
};

export default useUserNavigate;
