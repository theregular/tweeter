import { AuthTokenDto, StatusDto } from "tweeter-shared";

export interface IStatusDAO {
  getStoryPage(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  getFeedPage(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]>;
  postStatus(token: AuthTokenDto, newStatus: StatusDto): Promise<void>;
}
