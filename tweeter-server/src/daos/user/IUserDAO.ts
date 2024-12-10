import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IUserDAO {
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<UserDto>;

  login(alias: string, password: string): Promise<UserDto>;
  getUser(alias: string): Promise<UserDto>;

  getFolloweeCount(alias: string): Promise<number>;
  getFollowerCount(alias: string): Promise<number>;

  updateFolloweeCount(alias: string, count: number): Promise<void>;
  updateFollowerCount(alias: string, count: number): Promise<void>;
}
