import {
  AuthToken,
  User,
  FakeData,
  UserDto,
  AuthTokenDto,
} from "tweeter-shared";
import { IFollowDAO } from "../../daos/follow/IFollowDAO";
import { Service } from "./Service";

export class FollowService extends Service {
  private followDAO: IFollowDAO;

  constructor() {
    super();
    this.followDAO = this.daoFactory.getFollowDAO();
  }

  async loadMoreFollowers(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    //return this.getFakeData(lastItem, pageSize, userAlias);

    const isValidAuthtoken = await this.verifyAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }

    return this.followDAO.getPageOfFollowers(userAlias, pageSize, lastItem);
  }

  async loadMoreFollowees(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    //return this.getFakeData(lastItem, pageSize, userAlias);

    const isValidAuthtoken = await this.verifyAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }
    return this.followDAO.getPageOfFollowees(userAlias, pageSize, lastItem);
  }

  // private async getPageOfUsers(
  //   authToken: AuthTokenDto,
  //   userAlias: string,
  //   pageSize: number,
  //   lastItem: UserDto | null,
  //   getUsers: (
  //     authToken: AuthTokenDto,
  //     userAlias: string,
  //     pageSize: number,
  //     lastItem: UserDto | null
  //   ) => Promise<[UserDto[], boolean]>
  // ): Promise<[UserDto[], boolean]> {
  //   //TODO: verify authToken

  //   const [users, hasMore] = await getUsers(
  //     authToken,
  //     userAlias,
  //     pageSize,
  //     lastItem
  //   );
  //   return [users, hasMore];
  // }

  // private async getFakeData(
  //   lastItem: UserDto | null,
  //   pageSize: number,
  //   userAlias: string
  // ): Promise<[UserDto[], boolean]> {
  //   const [item, hasMore] = FakeData.instance.getPageOfUsers(
  //     User.fromDto(lastItem),
  //     pageSize,
  //     userAlias
  //   );
  //   const dtos = item.map((user) => user.dto);
  //   return [dtos, hasMore];
  // }
}
