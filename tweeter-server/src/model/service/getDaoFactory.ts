import { DAOFactoryAWS } from "../../daos/factory/DAOFactoryAWS";

export function getDaoFactory() {
  return new DAOFactoryAWS();
}
