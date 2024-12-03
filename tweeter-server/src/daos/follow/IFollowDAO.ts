import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IFollowDAO {
  getPageOfFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  getPageOfFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]>;

  getFollowerCount(alias: string): Promise<number>;

  getFolloweeCount(alias: string): Promise<number>;

  follow(
    alias: string,
    toFollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]>;

  unfollow(
    alias: string,
    toFollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]>;

  getIsFollowerStatus(user: UserDto, selectedUser: UserDto): Promise<boolean>;
}
