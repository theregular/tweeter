import { DAOFactoryDynamo } from "../../daos/factory/DAOFactoryDynamo";

export function getDaoFactory() {
  return new DAOFactoryDynamo();
}
