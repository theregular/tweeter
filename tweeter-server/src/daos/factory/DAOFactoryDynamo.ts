import { IFileDAO } from "../file/IFileDAO";
import { FollowDAODynamo } from "../follow/FollowDAODynamo";
import { IFollowDAO } from "../follow/IFollowDAO";
import { IStatusDAO } from "../status/IStatusDAO";
import { StatusDAODynamo } from "../status/StatusDAODynamo";
import { IUserDAO } from "../user/IUserDAO";
import { UserDAODynamo } from "../user/UserDAODynamo";
import { IDAOFactory } from "./IDAOFactory";

export class DAOFactoryDynamo implements IDAOFactory {
  // private static _instance: IDAOFactory;

  // public static get instance(): IDAOFactory {
  //   if (DAOFactoryDynamo._instance == null) {
  //     DAOFactoryDynamo._instance = new DAOFactoryDynamo();
  //   }

  //   return this._instance;
  // }

  getUserDAO(): IUserDAO {
    return new UserDAODynamo();
  }

  getFollowDAO(): IFollowDAO {
    return new FollowDAODynamo();
  }

  getStatusDAO(): IStatusDAO {
    return new StatusDAODynamo();
  }

  getFileDAO(): IFileDAO {
    throw new Error("Method not implemented.");
  }
}
