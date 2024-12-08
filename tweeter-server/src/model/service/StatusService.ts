import {
  AuthToken,
  AuthTokenDto,
  FakeData,
  Status,
  StatusDto,
} from "tweeter-shared";
import { IStatusDAO } from "../../daos/status/IStatusDAO";
import { Service } from "./Service";
import { ISQSDAO } from "../../daos/sqs/ISQSDAO";

export class StatusService extends Service {
  private statusDAO: IStatusDAO;
  private sqsDAO: ISQSDAO;

  constructor() {
    super();
    this.statusDAO = this.daoFactory.getStatusDAO();
    this.sqsDAO = this.daoFactory.getSQSDAO();
  }

  async loadMoreStoryItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    // return this.getFakeData(lastItem, pageSize);

    await this.validateAuthToken(authToken);
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
    await this.validateAuthToken(authToken);

    return this.statusDAO.getFeedPage(userAlias, pageSize, lastItem);
  }

  async postStatus(
    authToken: AuthTokenDto,
    newStatus: StatusDto
  ): Promise<void> {
    // await new Promise((f) => setTimeout(f, 2000));

    // validate auth token
    await this.validateAuthToken(authToken);

    //send to SQS
    await this.sqsDAO.postStatus(newStatus);
    //send to dynamo
    await this.statusDAO.postStatus(newStatus);
  }
}
