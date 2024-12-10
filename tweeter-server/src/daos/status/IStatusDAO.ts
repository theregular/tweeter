import { AuthTokenDto, StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  getStoryPage(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  getFeedPage(
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  postStatus(newStatus: StatusDto): Promise<void>;

  updateFeeds(status: StatusDto, followers: string[]): Promise<void>;
}
