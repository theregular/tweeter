import { AuthTokenDto, StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  loadMoreStoryItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  loadMoreFeedItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  postStatus(token: string, newStatus: StatusDto): Promise<void>;
}
