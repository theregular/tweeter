import { IFileDAO } from "../file/IFileDAO";
import { IFollowDAO } from "../follow/IFollowDAO";
import { IStatusDAO } from "../status/IStatusDAO";
import { IUserDAO } from "../user/IUserDAO";
import { UserDAODynamo } from "../user/UserDAODynamo";
import { IDAOFactory } from "./IDAOFactory";

export class DAOFactoryDynamo implements IDAOFactory {
  getUserDAO(): IUserDAO {
    return new UserDAODynamo();
  }

  getFollowDAO(): IFollowDAO {
    throw new Error("Method not implemented.");
  }

  getStatusDAO(): IStatusDAO {
    throw new Error("Method not implemented.");
  }

  getFileDAO(): IFileDAO {
    throw new Error("Method not implemented.");
  }
}
