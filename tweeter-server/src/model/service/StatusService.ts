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
import { IFollowDAO } from "../../daos/follow/IFollowDAO";
import { UserDto } from "tweeter-shared/src";

export class StatusService extends Service {
  private statusDAO: IStatusDAO;
  private sqsDAO: ISQSDAO;
  private followDAO: IFollowDAO;
  constructor() {
    super();
    this.statusDAO = this.daoFactory.getStatusDAO();
    this.sqsDAO = this.daoFactory.getSQSDAO();
    this.followDAO = this.daoFactory.getFollowDAO();
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

    //send to dynamo (to update user's story)
    await this.statusDAO.postStatus(newStatus);
    //send to SQS (to update user's followers' feeds)
    await this.sqsDAO.postStatus(newStatus);
  }

  public async sendMessagePostToFeed(status: StatusDto) {
    // Get followers who need feed updates
    // const alias = status.user.alias;
    // let lastItem: UserDto | null = null;
    // let followers: UserDto[] = [];
    // let hasMore = true;
    // while (hasMore) {
    //   [followers, hasMore] = await this.followDAO.getPageOfFollowers(
    //     alias,
    //     25,
    //     lastItem
    //   );
    //   lastItem = followers[followers.length - 1];
    //   // Send to feed queue to update their feeds
    //   const followerAliases = followers.map((f) => f.alias);
    //   await this.sqsDAO.updateFeed(status, followerAliases);
    // }
    const followers = await this.followDAO.getAllFollowerAliases(
      status.user.alias
    );

    // Send to feed queue to update their feeds

    await this.sqsDAO.updateFeed(status, followers);
  }

  public async updateFeeds(status: StatusDto, followers: string[]) {
    await this.statusDAO.updateFeeds(status, followers);
  }
}
