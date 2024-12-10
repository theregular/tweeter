import { UserDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/src";
import { IUserDAO } from "../../daos/user/IUserDAO";
import { IFollowDAO } from "../../daos/follow/IFollowDAO";
import { Service } from "./Service";
import { IFileDAO } from "../../daos/file/IFileDAO";

//TODO: move follow stuff to FollowService

export class UserService extends Service {
  private userDAO: IUserDAO;
  private followDAO: IFollowDAO;
  private fileDAO: IFileDAO;

  constructor() {
    super();
    this.userDAO = this.daoFactory.getUserDAO();
    this.followDAO = this.daoFactory.getFollowDAO();
    this.fileDAO = this.daoFactory.getFileDAO();
  }

  async getIsFollowerStatus(
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.isFollower();

    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }

    try {
      return this.followDAO.getIsFollowerStatus(user, selectedUser);
    } catch (e) {
      throw new Error("Error getting follower status");
    }
  }

  public async getFollowerCount(
    authToken: AuthTokenDto,
    user: UserDto | null
  ): Promise<number> {
    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }
    if (user === null) {
      return 0;
    }
    try {
      return this.userDAO.getFollowerCount(user.alias);
    } catch (e) {
      throw new Error("Error getting follower count");
    }
  }

  public async getFolloweeCount(
    authToken: AuthTokenDto,
    user: UserDto | null
  ): Promise<number> {
    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }
    if (user === null) {
      return 0;
    }
    try {
      return this.userDAO.getFolloweeCount(user.alias);
    } catch (e) {
      throw new Error("Error getting followee count");
    }
  }

  async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = await this.userDAO.login(alias, password);

    if (user === null) {
      throw new Error("Invalid alias or password");
    } else {
      const authToken = await this.generateAuthToken(alias);
      if (authToken === null) {
        throw new Error("Error generating auth token");
      }

      return [user, authToken];
    }
  }

  async logout(authToken: AuthTokenDto): Promise<void> {
    await this.deleteAuthToken(authToken);
  }

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    //upload image to S3
    const imageUrl = await this.fileDAO.putImage(
      alias + "." + imageFileExtension,
      userImageBytes
    );

    if (imageUrl === null) {
      throw new Error("Error uploading image");
    }

    //add user to user table
    const user = await this.userDAO.register(
      firstName,
      lastName,
      alias,
      password,
      imageUrl
    );

    if (user === null) {
      throw new Error("Error registering user");
    }

    //generate auth token and add to auth table
    const authToken = await this.generateAuthToken(alias);

    if (authToken === null) {
      throw new Error("Error generating auth token");
    }

    return [user, authToken];
  }

  async getUser(
    authToken: AuthTokenDto,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    // const user: User | null = FakeData.instance.findUserByAlias(alias);
    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }
    const user: UserDto | null = await this.userDAO.getUser(alias);
    return user === null ? null : user;
  }

  async follow(
    authToken: AuthTokenDto,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    //verify auth token and get user alias from it
    const aliasFromAuthToken = await this.getAliasFromAuthToken(authToken);
    if (aliasFromAuthToken === null) {
      throw new Error("Invalid auth token");
    }

    //update follow table
    try {
      await this.followDAO.follow(aliasFromAuthToken, userToFollow.alias);
    } catch (e) {
      throw new Error("Error following user");
    }

    //update follower count (of user to follow)
    try {
      await this.userDAO.updateFollowerCount(userToFollow.alias, 1);
    } catch (e) {
      throw new Error("Error updating follower count");
    }

    //update followee count (of user who followed)
    try {
      await this.userDAO.updateFolloweeCount(aliasFromAuthToken, 1);
    } catch (e) {
      throw new Error("Error updating followee count");
    }

    //get follower and followee count
    const followerCount = await this.userDAO.getFollowerCount(
      userToFollow.alias
    );
    const followeeCount = await this.userDAO.getFolloweeCount(
      aliasFromAuthToken
    );

    return [followerCount, followeeCount];
  }

  async unfollow(
    authToken: AuthTokenDto,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    //verify auth token and get user alias from it
    const aliasFromAuthToken = await this.getAliasFromAuthToken(authToken);
    if (aliasFromAuthToken === null) {
      throw new Error("Invalid auth token");
    }

    //update follow table
    try {
      await this.followDAO.unfollow(aliasFromAuthToken, userToUnfollow.alias);
    } catch (e) {
      throw new Error("Error unfollowing user");
    }

    //update follower count (of user to unfollow)
    try {
      await this.userDAO.updateFollowerCount(userToUnfollow.alias, -1);
    } catch (e) {
      throw new Error("Error updating follower count");
    }

    //update followee count (of user who unfollowed)
    try {
      await this.userDAO.updateFolloweeCount(aliasFromAuthToken, -1);
    } catch (e) {
      throw new Error("Error updating followee count");
    }

    //get follower and followee count
    const followerCount = await this.userDAO.getFollowerCount(
      userToUnfollow.alias
    );
    const followeeCount = await this.userDAO.getFolloweeCount(
      aliasFromAuthToken
    );

    return [followerCount, followeeCount];
  }
}
