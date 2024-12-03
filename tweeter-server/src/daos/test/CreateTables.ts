import { AuthDAODynamo } from "../auth/AuthDAODynamo";
import { FileDAOS3 } from "../file/FileDAOS3";
import { FollowDAODynamo } from "../follow/FollowDAODynamo";
import { StatusDAODynamo } from "../status/StatusDAODynamo";
import { UserDAODynamo } from "../user/UserDAODynamo";

const userDao = new UserDAODynamo();
const followDao = new FollowDAODynamo();
const statusDao = new StatusDAODynamo();
const fileDao = new FileDAOS3();
const authDao = new AuthDAODynamo();

const writeUnits = 5;
const readUnits = 5;

try {
  //user
  userDao.createUserTable(readUnits, writeUnits);
} catch (error) {
  console.error("Error creating User table:", error);
}

try {
  userDao.createPasswordTable(readUnits, writeUnits);
} catch (error) {
  console.error("Error creating Password table:", error);
}

//auth
try {
  authDao.createAuthTable(readUnits, writeUnits);
} catch (error) {
  console.error("Error creating Auth table:", error);
}

try {
  //follow
  followDao.createFollowTable(readUnits, writeUnits);
} catch (error) {
  console.error("Error creating Follow table:", error);
}

try {
  //status
  statusDao.createStoryTable(readUnits, writeUnits);
} catch (error) {
  console.error("Error creating Story table:", error);
}

try {
  statusDao.createFeedTable(readUnits, writeUnits);
} catch (error) {
  console.error("Error creating Feed table:", error);
}

//file
//image folder is automatically created when the first image is uploaded
