import { FileDAOS3 } from "../file/FileDAOS3";
import { FollowDAODynamo } from "../follow/FollowDAODynamo";
import { StatusDAODynamo } from "../status/StatusDAODynamo";
import { UserDAODynamo } from "../user/UserDAODynamo";

const userDao = new UserDAODynamo();
const followDao = new FollowDAODynamo();
const statusDao = new StatusDAODynamo();
const fileDao = new FileDAOS3();

// Delete content of all tables

//user
userDao.deleteUserTable();

//follow
followDao.deleteFollowTable();

//status
statusDao.deleteFeedTable();
statusDao.deleteStoryTable();

//file
fileDao.deleteAll();

// Create new empty tables
