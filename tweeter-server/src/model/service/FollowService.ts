import {
  AuthToken,
  User,
  FakeData,
  UserDto,
  AuthTokenDto,
} from "tweeter-shared";
import { IDAOFactory } from "../../daos/factory/IDAOFactory";
import { IFollowDAO } from "../../daos/follow/IFollowDAO";
import { getDaoFactory } from "./getDaoFactory";
import { DAOFactoryDynamo } from "../../daos/factory/DAOFactoryDynamo";

export class FollowService {
  private daoFactory: IDAOFactory;
  private followDAO: IFollowDAO;

  constructor() {
    this.daoFactory = getDaoFactory();
    // this.daoFactory = DAOFactoryDynamo.instance;
    this.followDAO = this.daoFactory.getFollowDAO();
  }

  async loadMoreFollowers(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    //return this.getFakeData(lastItem, pageSize, userAlias);

    return this.followDAO.getPageOfFollowers(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );
  }

  async loadMoreFollowees(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    //return this.getFakeData(lastItem, pageSize, userAlias);
    return this.followDAO.getPageOfFollowees(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );
  }

  // private async getPageOfUsers(
  //   authToken: AuthTokenDto,
  //   userAlias: string,
  //   pageSize: number,
  //   lastItem: UserDto | null,
  //   getUsers: (
  //     authToken: AuthTokenDto,
  //     userAlias: string,
  //     pageSize: number,
  //     lastItem: UserDto | null
  //   ) => Promise<[UserDto[], boolean]>
  // ): Promise<[UserDto[], boolean]> {
  //   //TODO: verify authToken

  //   const [users, hasMore] = await getUsers(
  //     authToken,
  //     userAlias,
  //     pageSize,
  //     lastItem
  //   );
  //   return [users, hasMore];
  // }

  // private async getFakeData(
  //   lastItem: UserDto | null,
  //   pageSize: number,
  //   userAlias: string
  // ): Promise<[UserDto[], boolean]> {
  //   const [item, hasMore] = FakeData.instance.getPageOfUsers(
  //     User.fromDto(lastItem),
  //     pageSize,
  //     userAlias
  //   );
  //   const dtos = item.map((user) => user.dto);
  //   return [dtos, hasMore];
  // }
}
