import { IAuthDAO } from "../auth/IAuthDAO";
import { IFileDAO } from "../file/IFileDAO";
import { IFollowDAO } from "../follow/IFollowDAO";
import { ISQSDAO } from "../sqs/ISQSDAO";
import { IStatusDAO } from "../status/IStatusDAO";
import { IUserDAO } from "../user/IUserDAO";

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getFollowDAO(): IFollowDAO;
  getStatusDAO(): IStatusDAO;
  getFileDAO(): IFileDAO;
  getAuthDAO(): IAuthDAO;
  getSQSDAO(): ISQSDAO;
}
