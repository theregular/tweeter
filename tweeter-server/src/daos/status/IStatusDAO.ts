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
  postStatus(token: AuthTokenDto, newStatus: StatusDto): Promise<void>;
}
