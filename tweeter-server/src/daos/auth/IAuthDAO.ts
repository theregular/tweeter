import { AuthTokenDto, UserDto } from "tweeter-shared";

export interface IAuthDAO {
  verifyAuthToken(token: AuthTokenDto): Promise<AuthTokenDto | null>;
  generateAuthToken(alias: string): Promise<AuthTokenDto>;
  deleteAuthToken(token: AuthTokenDto): Promise<void>;
  getAliasFromAuthToken(token: AuthTokenDto): Promise<string | null>;
}