import { IFileDAO } from "../file/IFileDAO";
import { IFollowDAO } from "../follow/IFollowDAO";
import { IStatusDAO } from "../status/IStatusDAO";
import { IUserDAO } from "../user/IUserDAO";

export interface IDAOFactory {
  getUserDAO(): IUserDAO;
  getFollowDAO(): IFollowDAO;
  getStatusDAO(): IStatusDAO;
  getFileDAO(): IFileDAO;
}
