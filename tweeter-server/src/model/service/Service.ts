import { AuthTokenDto } from "tweeter-shared";
import { IAuthDAO } from "../../daos/auth/IAuthDAO";
import { IDAOFactory } from "../../daos/factory/IDAOFactory";
import { getDaoFactory } from "./getDaoFactory";

export abstract class Service {
  protected daoFactory: IDAOFactory;
  private authDAO: IAuthDAO;
  constructor() {
    this.daoFactory = getDaoFactory();
    this.authDAO = this.daoFactory.getAuthDAO();
  }

  async getAuthToken(authToken: AuthTokenDto): Promise<AuthTokenDto | null> {
    return await this.authDAO.getAuthToken(authToken);
  }

  async generateAuthToken(alias: string): Promise<AuthTokenDto> {
    return await this.authDAO.generateAuthToken(alias);
  }

  async deleteAuthToken(authToken: AuthTokenDto): Promise<void> {
    return await this.authDAO.deleteAuthToken(authToken);
  }

  async getAliasFromAuthToken(authToken: AuthTokenDto): Promise<string | null> {
    return await this.authDAO.getAliasFromAuthToken(authToken);
  }
}
