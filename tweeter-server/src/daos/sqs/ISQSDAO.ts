import { StatusDto } from "tweeter-shared";

export interface ISQSDAO {
  postStatus(status: StatusDto): Promise<void>;
  updateFeed(status: StatusDto, followers: string[]): Promise<void>;
}
