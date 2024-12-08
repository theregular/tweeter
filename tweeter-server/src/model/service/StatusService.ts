import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  Status,
  StatusDto,
} from "tweeter-shared";
import { IStatusDAO } from "../../daos/status/IStatusDAO";
import { Service } from "./Service";

export class StatusService extends Service {
  private statusDAO: IStatusDAO;

  constructor() {
    super();
    this.statusDAO = this.daoFactory.getStatusDAO();
  }

  async loadMoreStoryItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize);

    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }

    return this.statusDAO.getStoryPage(userAlias, pageSize, lastItem);
  }

  async loadMoreFeedItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize);
    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }

    return this.statusDAO.getFeedPage(userAlias, pageSize, lastItem);
  }

  async postStatus(
    authToken: AuthTokenDto,
    newStatus: StatusDto
  ): Promise<void> {
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status
    const isValidAuthtoken = await this.getAuthToken(authToken);
    if (isValidAuthtoken === null) {
      throw new Error("Invalid auth token");
    }

    return this.statusDAO.postStatus(newStatus);
  }

  // private async getFakeData(
  //   lastItem: StatusDto | null,
  //   pageSize: number
  // ): Promise<[StatusDto[], boolean]> {
  //   const [item, hasMore] = FakeData.instance.getPageOfStatuses(
  //     Status.fromDto(lastItem),
  //     pageSize
  //   );
  //   const dtos = item.map((status) => status.dto);
  //   return [dtos, hasMore];
  // }
}
