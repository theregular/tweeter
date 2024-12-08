import { UserDAODynamo } from "../user/UserDAODynamo";
import { FollowDAODynamo } from "../follow/FollowDAODynamo";
import { StatusDAODynamo } from "../status/StatusDAODynamo";
import { Type } from "tweeter-shared";
import { FileDAOS3 } from "../file/FileDAOS3";
import fs from "fs";
import { AuthDAODynamo } from "../auth/AuthDAODynamo";
import { UserService } from "../../model/service/UserService";
import { SQSDAOAWS } from "../sqs/SQSDAOAWS";

const userDao = new UserDAODynamo();
const followDao = new FollowDAODynamo();
const statusDao = new StatusDAODynamo();
const fileDao = new FileDAOS3();
const authDao = new AuthDAODynamo();
const sqsDao = new SQSDAOAWS();

// userDao
//   .register("John", "Doe", "@johndoe", "password", "0", "jpg")
//   .then((result) => {
//     console.log(result);
//   });

// userDao
//   .register("Jane", "Smith", "@janesmith", "password", "0", "jpg")
//   .then((result) => {
//     console.log(result);
//   });

// userDao.register("qwer", "qwer", "@qwer", "qwer", "0", "jpg").then((result) => {
//   console.log(result);
// });

// userDao.login("@a", "password1").then((result) => {
//   console.log(result);
// });

// userDao.login("@a", "a").then((result) => {
//   console.log(result);
// });

// userDao.login("johndoe", "wrongpassword").then((result) => {
//   console.log(result);
// });

// userDao.getUser({ token: "token", timestamp: 0 }, "johndoe").then((result) => {
//   console.log(result);
// });

// userDao.getUser({ token: "token", timestamp: 0 }, "johndoe").then((result) => {
//   console.log(result);
// });

// followDao
//   .follow({ token: "token", timestamp: 0 }, "@johndoe", "@janesmith")
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .follow({ token: "token", timestamp: 0 }, "@janesmith", "@johndoe")
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .follow({ token: "token", timestamp: 0 }, "@johndoe", "@qwer")
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
//       alias: "@johndoe",
//       firstName: "John",
//       lastName: "Doe",
//       imageUrl: "TODO: implement profile image",
//     },
//     {
//       alias: "@qwer",
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
//       alias: "@johndoe",
//       firstName: "John",
//       lastName: "Doe",
//       imageUrl: "TODO: implement profile image",
//     }
//   )
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .getPageOfFollowees({ token: "token", timestamp: 0 }, "@johndoe", 10, null)
//   .then((result) => {
//     console.log(result);
//   });

// followDao
//   .getPageOfFollowers({ token: "token", timestamp: 0 }, "@johndoe", 10, null)
//   .then((result) => {
//     console.log(result);
//   });

// const newStatus = {
//   user: {
//     alias: "@johndoe",
//     firstName: "John",
//     lastName: "Doe",
//     imageUrl: "TODO: implement profile image",
//   },
//   post: "Hello, world!",
//   timestamp: 0,
//   segments: [
//     {
//       text: "Hello, world!",
//       startPosition: 0,
//       endPosition: 13,
//       type: Type.text,
//     },
//   ],
// };

// const newStatus3 = {
//   user: {
//     alias: "@johndoe",
//     firstName: "John",
//     lastName: "Doe",
//     imageUrl: "TODO: implement profile image",
//   },
//   post: "Post 0 0\n        My friend @amy likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
//   timestamp: 1,
//   segments: [
//     {
//       text: "Post 0 0\n        My friend ",
//       startPosition: 0,
//       endPosition: 28,
//       type: Type.text,
//     },
//     {
//       text: "@amy",
//       startPosition: 28,
//       endPosition: 33,
//       type: Type.alias,
//     },
//     {
//       text: " likes this website: ",
//       startPosition: 33,
//       endPosition: 55,
//       type: Type.text,
//     },
//     {
//       text: "http://byu.edu",
//       startPosition: 55,
//       endPosition: 68,
//       type: Type.url,
//     },
//     {
//       text: ". Do you? \n        Or do you prefer this one: ",
//       startPosition: 68,
//       endPosition: 104,
//       type: Type.text,
//     },
//     {
//       text: "http://cs.byu.edu",
//       startPosition: 104,
//       endPosition: 119,
//       type: Type.url,
//     },
//     {
//       text: "?",
//       startPosition: 119,
//       endPosition: 120,
//       type: Type.text,
//     },
//   ],
// };

// const newStatus2 = {
//   user: {
//     alias: "@janesmith",
//     firstName: "Jane",
//     lastName: "Smith",
//     imageUrl: "TODO: implement profile image",
//   },
//   post: "Post 0 0\n        My friend @amy likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
//   timestamp: 1,
//   segments: [
//     {
//       text: "Post 0 0\n        My friend ",
//       startPosition: 0,
//       endPosition: 28,
//       type: Type.text,
//     },
//     {
//       text: "@amy",
//       startPosition: 28,
//       endPosition: 33,
//       type: Type.alias,
//     },
//     {
//       text: " likes this website: ",
//       startPosition: 33,
//       endPosition: 55,
//       type: Type.text,
//     },
//     {
//       text: "http://byu.edu",
//       startPosition: 55,
//       endPosition: 68,
//       type: Type.url,
//     },
//     {
//       text: ". Do you? \n        Or do you prefer this one: ",
//       startPosition: 68,
//       endPosition: 104,
//       type: Type.text,
//     },
//     {
//       text: "http://cs.byu.edu",
//       startPosition: 104,
//       endPosition: 119,
//       type: Type.url,
//     },
//     {
//       text: "?",
//       startPosition: 119,
//       endPosition: 120,
//       type: Type.text,
//     },
//   ],
// };

// statusDao
//   .postStatus({ token: "token", timestamp: 0 }, newStatus)
//   .then((result) => {
//     console.log(result);
//   });

// statusDao
//   .postStatus({ token: "token", timestamp: 0 }, newStatus2)
//   .then((result) => {
//     console.log(result);
//   });

// statusDao
//   .postStatus({ token: "token", timestamp: 0 }, newStatus3)
//   .then((result) => {
//     console.log(result);
//   });

// statusDao
//   .getStoryPage({ token: "token", timestamp: 0 }, "@johndoe", 1, null)
//   .then((result) => {
//     console.log(result);
//   });

// function encodeImageToBase64(filePath: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data.toString("base64"));
//       }
//     });
//   });
// }

// const imagePath = "./test_images/mario.png"; // Update this path to the location of your mario.png file

// encodeImageToBase64(imagePath)
//   .then((base64Image) => {
//     fileDao
//       .putImage("@test1.png", base64Image)
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((error) => {
//         console.error("Error uploading image:", error);
//       });
//   })
//   .catch((error) => {
//     console.error("Error encoding image:", error);
//   });

// authDao.generateAuthToken("@johndoe").then((result) => {
//   console.log(result);
//   authDao.verifyAuthToken(result).then((result) => {
//     console.log(result);
//   });
// });

// authDao.verifyAuthToken({ token: "token", timestamp: 0 }).then((result) => {
//   console.log(result);
// });

// authDao.verifyAuthToken(authToken).then((result) => {
//   console.log(result);
// });

// create mario

// const userService = new UserService();

// const imagePath = "./test_images/mario.png";

// function encodeImageToBase64(filePath: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filePath, (err, data) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data.toString("base64"));
//       }
//     });
//   });
// }

// encodeImageToBase64(imagePath)
//   .then((base64Image) => {
//     userService
//       .register("Mario", "Mario", "@mario", "password", base64Image, "png")
//       .then((result) => {
//         console.log(result);
//       });
//   })
//   .catch((error) => {
//     console.error("Error encoding image:", error);
//   });

sqsDao
  .postStatus({
    user: {
      alias: "@mario",
      firstName: "Mario",
      lastName: "Mario",
      imageUrl: "img",
    },
    post: "It's a me, Mario!",
    timestamp: 0,
    segments: [
      {
        text: "It's a me, Mario!",
        startPosition: 0,
        endPosition: 16,
        type: Type.text,
      },
    ],
  })
  .then((result) => {
    console.log(result);
  });
