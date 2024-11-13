import {
  AuthToken,
  User,
  FakeData,
  PagedItemRequest,
  UserDto,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private serverFacade = new ServerFacade();

  async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDto> = {
      authToken: authToken,
      userAlias,
      pageSize,
      lastItem: lastItem
        ? {
            firstName: lastItem.firstName,
            lastName: lastItem.lastName,
            alias: lastItem.alias,
            imageUrl: lastItem.imageUrl,
          }
        : null,
    };
    // console.log("***LOAD MORE FOLLOWERES request: ", request);
    return await this.serverFacade.loadMoreFollowers(request);
  }

  async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedItemRequest<UserDto> = {
      authToken: authToken,
      userAlias,
      pageSize,
      lastItem: lastItem
        ? {
            firstName: lastItem.firstName,
            lastName: lastItem.lastName,
            alias: lastItem.alias,
            imageUrl: lastItem.imageUrl,
          }
        : null,
    };
    return await this.serverFacade.loadMoreFollowees(request);
  }
}
