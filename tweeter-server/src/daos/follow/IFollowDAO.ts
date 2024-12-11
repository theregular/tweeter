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

  follow(alias: string, toFollowAlias: string): Promise<void>;

  unfollow(alias: string, toFollowAlias: string): Promise<void>;

  getIsFollowerStatus(user: UserDto, selectedUser: UserDto): Promise<boolean>;

  getAllFollowerAliases(userAlias: string): Promise<string[]>;
}
