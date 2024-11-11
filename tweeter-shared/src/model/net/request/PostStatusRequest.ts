import { Status } from "../../domain/Status";

export interface PostStatusRequest {
  readonly token: string;
  readonly status: Status;
}
