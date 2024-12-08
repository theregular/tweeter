import { Buffer } from "buffer";
import { FakeData, User, UserDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/src";
import { IUserDAO } from "../../daos/user/IUserDAO";
import { IDAOFactory } from "../../daos/factory/IDAOFactory";
import { getDaoFactory } from "./getDaoFactory";
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
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getFollowerCount(user?.alias ? user?.alias : "");

    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }
    if (user === null) {
      return 0;
    }
    try {
      return this.followDAO.getFollowerCount(user.alias);
    } catch (e) {
      throw new Error("Error getting follower count");
    }
  }

  public async getFolloweeCount(
    authToken: AuthTokenDto,
    user: UserDto | null
  ): Promise<number> {
    // TODO: Replace with the result of calling server

    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }
    if (user === null) {
      return 0;
    }
    try {
      return this.followDAO.getFollowerCount(user.alias);
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

  //TODO: implement logout
  async logout(authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    // await new Promise((res) => setTimeout(res, 1000));

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
    // Not needed now, but will be needed when you make the request to the server in milestone 3
    // const imageStringBase64: string =
    //   Buffer.from(userImageBytes).toString("base64");

    // // TODO: Replace with the result of calling the server
    // const user = FakeData.instance.firstUser?.dto;

    // return [user!, FakeData.instance.authToken.dto];

    const user = await this.userDAO.register(
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension
    );

    if (user === null) {
      throw new Error("Error registering user");
    }

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
    // Pause so we can see the follow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    //verify auth token and get user alias from it
    const aliasFromAuthToken = await this.getAliasFromAuthToken(authToken);
    if (aliasFromAuthToken === null) {
      throw new Error("Invalid auth token");
    }

    return await this.followDAO.follow(aliasFromAuthToken, userToFollow.alias);
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

    return await this.followDAO.unfollow(
      aliasFromAuthToken,
      userToUnfollow.alias
    );
  }
}
