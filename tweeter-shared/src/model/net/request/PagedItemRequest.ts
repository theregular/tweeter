import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest<D> extends TweeterRequest {
  readonly token: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: D | null;
}
