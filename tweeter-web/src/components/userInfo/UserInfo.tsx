import "./UserInfo.css";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import {
  UserInfoPresenter,
  UserInfoView,
} from "../../presenter/UserInfoPresenter";
import { UserInfoContext } from "./UserInfoProvider";

// interface Props {
//   presenterGenerator: (view: UserInfoView) => UserInfoPresenter;
// }

const UserInfo = () => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

  const { currentUser, authToken, displayedUser, setDisplayedUser } =
    useUserInfo();

  if (!displayedUser) {
    setDisplayedUser(currentUser!);
  }

  const listener: UserInfoView = {
    displayErrorMessage: displayErrorMessage,
    displayInfoMessage: displayInfoMessage,
    clearLastInfoMessage: clearLastInfoMessage,
  };

  const [presenter] = useState(new UserInfoPresenter(listener));
  const [isFollower, setIsFollower] = useState(false);
  const [followeeCount, setFolloweeCount] = useState(-1);
  const [followerCount, setFollowerCount] = useState(-1);

  useEffect(() => {
    const updateUserInfo = async () => {
      setIsFollower(
        await presenter.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        )
      );

      setFolloweeCount(
        await presenter.getNumbFollowees(authToken!, displayedUser!)
      );

      setFollowerCount(
        await presenter.getNumbFollowers(authToken!, displayedUser!)
      );
    };
    updateUserInfo();
  }, [displayedUser]);

  const switchToLoggedInUser = (event: React.MouseEvent): void => {
    event.preventDefault();
    setDisplayedUser(currentUser!);
  };

  return (
    <div className={presenter.isLoading ? "loading" : ""}>
      {currentUser === null || displayedUser === null || authToken === null ? (
        <></>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-auto p-3">
              <img
                src={displayedUser.imageUrl}
                className="img-fluid"
                width="100"
                alt="Posting user"
              />
            </div>
            <div className="col p-3">
              {displayedUser !== currentUser && (
                <p id="returnToLoggedInUser">
                  Return to{" "}
                  <Link
                    to={""}
                    onClick={(event) => switchToLoggedInUser(event)}
                  >
                    logged in user
                  </Link>
                </p>
              )}
              <h2>
                <b>{displayedUser.name}</b>
              </h2>
              <h3>{displayedUser.alias}</h3>
              <br />
              {followeeCount > -1 && followerCount > -1 && (
                <div>
                  Followees: {followeeCount} Followers: {followerCount}
                </div>
              )}
            </div>
            <form>
              {displayedUser !== currentUser && (
                <div className="form-group">
                  {isFollower ? (
                    <button
                      id="unFollowButton"
                      className="btn btn-md btn-secondary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={async (event) => {
                        const [newFollowerCount, newFolloweeCount] =
                          await presenter.unfollowDisplayedUser(
                            authToken,
                            displayedUser,
                            event
                          );
                        setIsFollower(false);
                        setFollowerCount(newFollowerCount);
                        setFolloweeCount(newFolloweeCount);
                      }}
                    >
                      {presenter.isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Unfollow</div>
                      )}
                    </button>
                  ) : (
                    <button
                      id="followButton"
                      className="btn btn-md btn-primary me-1"
                      type="submit"
                      style={{ width: "6em" }}
                      onClick={async (event) => {
                        const [newFollowerCount, newFolloweeCount] =
                          await presenter.followDisplayedUser(
                            authToken,
                            displayedUser,
                            event
                          );
                        setIsFollower(true);
                        setFollowerCount(newFollowerCount);
                        setFolloweeCount(newFolloweeCount);
                      }}
                    >
                      {presenter.isLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        <div>Follow</div>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
