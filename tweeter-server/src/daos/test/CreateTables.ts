import { FileDAOS3 } from "../file/FileDAOS3";
import { FollowDAODynamo } from "../follow/FollowDAODynamo";
import { StatusDAODynamo } from "../status/StatusDAODynamo";
import { UserDAODynamo } from "../user/UserDAODynamo";

const userDao = new UserDAODynamo();
const followDao = new FollowDAODynamo();
const statusDao = new StatusDAODynamo();
const fileDao = new FileDAOS3();

try {
  //user
  userDao.createUserTable();
} catch (error) {
  console.error("Error creating User table:", error);
}

try {
  userDao.createAuthTable();
} catch (error) {
  console.error("Error creating Auth table:", error);
}

try {
  userDao.createPasswordTable();
} catch (error) {
  console.error("Error creating Password table:", error);
}

try {
  //follow
  followDao.createFollowTable();
} catch (error) {
  console.error("Error creating Follow table:", error);
}

try {
  //status
  statusDao.createStoryTable();
} catch (error) {
  console.error("Error creating Story table:", error);
}

try {
  statusDao.createFeedTable();
} catch (error) {
  console.error("Error creating Feed table:", error);
}

//file
//image folder is automatically created when the first image is uploaded
