import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import useUserInfo from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import StatusItemScroller from "./components/mainLayout/StatusItemScroller";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { LoginPresenter, LoginView } from "./presenter/LoginPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";
import { RegisterPresenter, RegisterView } from "./presenter/RegisterPresenter";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        {/* <Route path="feed" element={<FeedScroller />} />
        <Route path="story" element={<StoryScroller />} /> */}
        <Route
          path="feed"
          element={
            <StatusItemScroller
              key={1}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new FeedPresenter(view)
              }
            />
          }
        />
        <Route
          path="story"
          element={
            <StatusItemScroller
              key={1}
              presenterGenerator={(view: PagedItemView<Status>) =>
                new StoryPresenter(view)
              }
            />
          }
        />
        <Route
          path="followees"
          element={
            <UserItemScroller
              key={1}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FolloweePresenter(view)
              }
            />
          }
        />
        <Route
          path="followers"
          element={
            <UserItemScroller
              key={2}
              presenterGenerator={(view: PagedItemView<User>) =>
                new FollowerPresenter(view)
              }
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            presenterGenerator={(view: LoginView) =>
              new LoginPresenter<LoginView>(view)
            }
          />
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="*"
        element={
          <Login
            presenterGenerator={(view: LoginView) =>
              new LoginPresenter<LoginView>(view)
            }
          />
        }
      />
    </Routes>
  );
};

export default App;
