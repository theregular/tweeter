import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IUserDAO {
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]>;

  login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]>;

  //logout?

  getUser(authToken: AuthTokenDto, alias: string): Promise<UserDto>;
}
