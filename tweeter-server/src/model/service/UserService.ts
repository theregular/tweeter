import { Buffer } from "buffer";
import { FakeData, User, UserDto } from "tweeter-shared";
import { AuthTokenDto } from "tweeter-shared/src";
import { IUserDAO } from "../../daos/user/IUserDAO";
import { IDAOFactory } from "../../daos/factory/IDAOFactory";
import { getDaoFactory } from "./getDaoFactory";
import { IFollowDAO } from "../../daos/follow/IFollowDAO";

//TODO: move follow stuff to FollowService

export class UserService {
  private daoFactory: IDAOFactory;
  private userDAO: IUserDAO;
  // private followDAO: IFollowDAO;

  constructor() {
    this.daoFactory = getDaoFactory();
    this.userDAO = this.daoFactory.getUserDAO();
    // this.followDAO = this.daoFactory.getFollowDAO();
  }

  async getIsFollowerStatus(
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFollowerCount(
    token: AuthTokenDto,
    user: UserDto | null
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user?.alias ? user?.alias : "");
  }

  public async getFolloweeCount(
    token: AuthTokenDto,
    user: UserDto | null
  ): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user?.alias ? user?.alias : "");
  }

  async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const [user, authToken] = await this.userDAO.login(alias, password);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, authToken];
  }

  async logout(authToken: AuthTokenDto): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
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

    return await this.userDAO.register(
      firstName,
      lastName,
      alias,
      password,
      userImageBytes,
      imageFileExtension
    );
  }

  async getUser(
    authToken: AuthTokenDto,
    alias: string
  ): Promise<UserDto | null> {
    // TODO: Replace with the result of calling server
    // const user: User | null = FakeData.instance.findUserByAlias(alias);
    const user: UserDto | null = await this.userDAO.getUser(authToken, alias);
    return user === null ? null : user;
  }

  async follow(
    token: AuthTokenDto,
    userToFollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToFollow);
    const followeeCount = await this.getFolloweeCount(token, userToFollow);

    return [followerCount, followeeCount];
  }

  async unfollow(
    token: AuthTokenDto,
    userToUnfollow: UserDto
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.getFollowerCount(token, userToUnfollow);
    const followeeCount = await this.getFolloweeCount(token, userToUnfollow);

    return [followerCount, followeeCount];
  }
}
