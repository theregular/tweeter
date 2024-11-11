import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse<D> extends TweeterResponse {
  readonly items: D[] | null;
  readonly hasMore: boolean;
}
