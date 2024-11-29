import { UserDAODynamo } from "./user/UserDAODynamo";
import { FollowDAODynamo } from "./follow/FollowDAODynamo";

const userDao = new UserDAODynamo();
const followDao = new FollowDAODynamo();

// userDao
//   .register("John", "Doe", "johndoe", "password", "0", "jpg")
//   .then((result) => {
//     console.log(result);
//   });

// userDao
//   .register("Jane", "Smith", "janesmith", "password", "0", "jpg")
//   .then((result) => {
//     console.log(result);
//   });

// userDao.register("qwer", "qwer", "qwer", "qwer", "0", "jpg").then((result) => {
//   console.log(result);
// });

// userDao.login("johndoe", "password").then((result) => {
//   console.log(result);
// });

// userDao.login("johndoe", "wrongpassword").then((result) => {
//   console.log(result);
// });

// userDao.getUser({ token: "token", timestamp: 0 }, "johndoe").then((result) => {
//   console.log(result);
// });

// userDao
//   .getUser({ token: "token", timestamp: 0 }, "janesmith")
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .follow({ token: "token", timestamp: 0 }, "johndoe", "janesmith")
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .follow({ token: "token", timestamp: 0 }, "janesmith", "johndoe")
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .follow({ token: "token", timestamp: 0 }, "johndoe", "qwer")
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .unfollow({ token: "token", timestamp: 0 }, "johndoe", "qwer")
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .getIsFollowerStatus(
//     { token: "token", timestamp: 0 },
//     {
//       alias: "qwer",
//       firstName: "John",
//       lastName: "Doe",
//       imageUrl: "TODO: implement profile image",
//     },
//     {
//       alias: "johndoe",
//       firstName: "Qwer",
//       lastName: "Qwer",
//       imageUrl: "TODO: implement profile image",
//     }
//   )
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .getFolloweeCount(
//     { token: "token", timestamp: 0 },
//     {
//       alias: "johndoe",
//       firstName: "John",
//       lastName: "Doe",
//       imageUrl: "TODO: implement profile image",
//     }
//   )
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .getFollowees({ token: "token", timestamp: 0 }, "johndoe", 1, null)
//   .then((result) => {
//     console.log(result);
//     const lastKey = result[1];
//     if (lastKey != undefined) {
//       followDao
//         .getFollowees({ token: "token", timestamp: 0 }, "johndoe", 1, lastKey)
//         .then((result) => {
//           console.log(result);
//         });
//     }
//   });
