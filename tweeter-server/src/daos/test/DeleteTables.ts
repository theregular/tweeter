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

// Delete content of all tables

try {
  // user
  userDao.deleteUserTable();
} catch (error) {
  console.error("Error deleting User Table:", (error as Error).message);
}

try {
  userDao.deletePasswordTable();
} catch (error) {
  console.error("Error deleting Password Table:", (error as Error).message);
}

try {
  authDao.deleteAuthTable();
} catch (error) {
  console.error("Error deleting Auth Table:", (error as Error).message);
}

try {
  // follow
  followDao.deleteFollowTable();
} catch (error) {
  console.error("Error deleting Follow Table:", (error as Error).message);
}

try {
  // status
  statusDao.deleteFeedTable();
} catch (error) {
  console.error("Error deleting Feed Table:", (error as Error).message);
}

try {
  statusDao.deleteStoryTable();
} catch (error) {
  console.error("Error deleting Story Table:", (error as Error).message);
}

try {
  // file
  fileDao.deleteAll();
} catch (error) {
  console.error("Error deleting File Table:", (error as Error).message);
}
