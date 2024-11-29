import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GetFollowCountRequest extends TweeterRequest {
  readonly token: AuthTokenDto;
  readonly user: UserDto;
}
