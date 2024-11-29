import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IFollowDAO {
  getPageOfFollowees(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  getPageOfFollowers(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  getFollowerCount(token: AuthTokenDto, user: UserDto | null): Promise<number>;

  getFolloweeCount(token: AuthTokenDto, user: UserDto | null): Promise<number>;

  follow(
    authToken: AuthTokenDto,
    alias: string,
    toFollowAlias: string,
    name: string,
    toFollowName: string
  ): Promise<[followerCount: number, followeeCount: number]>;

  unfollow(
    authToken: AuthTokenDto,
    alias: string,
    toFollowAlias: string,
    name: string,
    toFollowName: string
  ): Promise<[followerCount: number, followeeCount: number]>;

  getIsFollowerStatus(
    authToken: AuthTokenDto,
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean>;
}
