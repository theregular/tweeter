import { AuthTokenDto } from "../../dto/AuthTokenDto";

export interface GetUserRequest {
  readonly authToken: AuthTokenDto;
  readonly alias: string;
}
