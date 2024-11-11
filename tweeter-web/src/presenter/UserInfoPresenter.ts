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

  async setIsFollowerStatus(
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
  }

  async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.followeeCount = await this.service.getFolloweeCount(
        authToken,
        displayedUser
      );
    }, "get followees count");
  }

  async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    await this.doFailureReportingOperation(async () => {
      this.followeeCount = await this.service.getFollowerCount(
        authToken,
        displayedUser
      );
    }, "get followers count");
  }

  async followDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    event: React.MouseEvent
  ): Promise<void> {
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
  }

  async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User,
    event: React.MouseEvent
  ): Promise<void> {
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
  }
}
