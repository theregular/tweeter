import {
  AuthToken,
  User,
  FakeData,
  UserDto,
  AuthTokenDto,
} from "tweeter-shared";

export class FollowService {
  async loadMoreFollowers(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  async loadMoreFollowees(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [item, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = item.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
