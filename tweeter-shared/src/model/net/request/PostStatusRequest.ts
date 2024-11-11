import { Status } from "../../domain/Status";
import { TweeterRequest } from "./TweeterRequest";

export interface PostStatusRequest extends TweeterRequest {
  readonly token: string;
  readonly status: Status;
}
