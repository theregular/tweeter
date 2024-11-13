import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface LoginResponse extends TweeterResponse {
  readonly user: UserDto;
  readonly token: string;
}
