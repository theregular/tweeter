import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  Status,
  StatusDto,
} from "tweeter-shared";
import { IDAOFactory } from "../../daos/factory/IDAOFactory";
import { IStatusDAO } from "../../daos/status/IStatusDAO";
import { getDaoFactory } from "./getDaoFactory";

export class StatusService {
  private daoFactory: IDAOFactory;
  private statusDAO: IStatusDAO;

  constructor() {
    this.daoFactory = getDaoFactory();
    this.statusDAO = this.daoFactory.getStatusDAO();
    // this.followDAO = this.daoFactory.getFollowDAO();
  }

  async loadMoreStoryItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize);
    return this.statusDAO.getStoryPage(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );
  }

  async loadMoreFeedItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  async postStatus(token: AuthTokenDto, newStatus: StatusDto): Promise<void> {
    // await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server to post the status

    return this.statusDAO.postStatus(token, newStatus);
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [item, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = item.map((status) => status.dto);
    return [dtos, hasMore];
  }
}
