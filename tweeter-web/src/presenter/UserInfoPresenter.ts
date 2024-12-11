import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserInfoView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private service: UserService;
  public isFollower = false;
  public followeeCount = -1;
  public followerCount = -1;

  public constructor(view: UserInfoView) {
    super(view);
    this.service = new UserService();
  }

  async getIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    await this.doFailureReportingOperation(async () => {
      if (currentUser === displayedUser) {
        this.isFollower = false;
      } else {
        this.isFollower = await this.service.getIsFollowerStatus(
          authToken!,
          currentUser!,
          displayedUser!
        );
      }
    }, "determine follower status");
    return this.isFollower;
  }

  async getNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.followeeCount = await this.service.getFolloweeCount(
        authToken,
        displayedUser
      );
    }, "get followees count");
    return this.followeeCount;
  }

  async getNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.followerCount = await this.service.getFollowerCount(
        authToken,
        displayedUser
      );
    }, "get followers count");
    return this.followerCount;
  }

  async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    event: React.MouseEvent
  ) {
    event.preventDefault();

    await this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        await this.view.displayInfoMessage(
          `Following ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await this.service.follow(
          authToken!,
          displayedUser!
        );

        this.isFollower = true;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
      },
      "follow user",
      this.view.clearLastInfoMessage
    );
    return [this.followerCount, this.followeeCount];
  }

  async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    event: React.MouseEvent
  ) {
    event.preventDefault();
    await this.doFailureReportingOperation(
      async () => {
        this.isLoading = true;
        this.view.displayInfoMessage(
          `Unfollowing ${displayedUser!.name}...`,
          0
        );

        const [followerCount, followeeCount] = await this.service.unfollow(
          authToken!,
          displayedUser!
        );

        this.isFollower = false;
        this.followerCount = followerCount;
        this.followeeCount = followeeCount;
      },
      "unfollow user",
      this.view.clearLastInfoMessage
    );
    return [this.followerCount, this.followeeCount];
  }
}
