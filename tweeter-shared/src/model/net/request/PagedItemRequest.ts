import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { StatusDto } from "../../dto/StatusDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<D> extends TweeterRequest {
  readonly authToken: AuthTokenDto;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: D | null;
}
