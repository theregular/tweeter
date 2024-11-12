import {
  AuthToken,
  FakeData,
  PagedItemRequest,
  PostStatusRequest,
  Status,
  StatusDto,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedItemRequest<StatusDto> = {
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return await this.serverFacade.loadMoreStoryItems(request);
  }

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    // console.log(
    //   "**LAST ITEM DTO: ",
    //   lastItem ? lastItem.dto : "LAST ITEM GIVEN AS NULL"
    // );
    const request: PagedItemRequest<StatusDto> = {
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      userAlias,
      pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    // console.log("***LOAD MORE FEED request json: ", JSON.stringify(request));
    // console.log("***LOAD MORE FEED before serverFacade call");
    return await this.serverFacade.loadMoreFeedItems(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request: PostStatusRequest = {
      authToken: {
        token: authToken.token,
        timestamp: authToken.timestamp,
      },
      status: newStatus.dto,
    };
    await this.serverFacade.postStatus(request);
  }
}
