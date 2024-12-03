import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IUserDAO {
  register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    imageFileExtension: string
  ): Promise<UserDto>;

  login(alias: string, password: string): Promise<UserDto>;

  //logout? - handle in AuthDAO

  getUser(alias: string): Promise<UserDto>;
}
