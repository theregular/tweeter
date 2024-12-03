// import { UserDto } from "tweeter-shared/src";
// import { FollowDAODynamo } from "../follow/FollowDAODynamo";
// import { StatusDAODynamo } from "../status/StatusDAODynamo";
// import { UserDAODynamo } from "../user/UserDAODynamo";
// import fs from "fs";
// import { StatusDto, Type } from "tweeter-shared";

// const userDao = new UserDAODynamo();
// const followDao = new FollowDAODynamo();
// const statusDao = new StatusDAODynamo();

// // Helper functions
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

// // Create users for testing
// async function createUsers() {
//   const imagePath = "./src/daos/test/test_images/";

//   const users = [
//     {
//       firstName: "Mario",
//       lastName: "Toadstool",
//       alias: "@mario",
//       image: "mario.png",
//     },
//     {
//       firstName: "Luigi",
//       lastName: "ToadStool",
//       alias: "@luigi",
//       image: "luigi.png",
//     },
//     {
//       firstName: "Peach",
//       lastName: "Princess",
//       alias: "@peach",
//       image: "peach.png",
//     },
//     {
//       firstName: "Daisy",
//       lastName: "Princess",
//       alias: "@daisy",
//       image: "daisy.png",
//     },
//     {
//       firstName: "Toad",
//       lastName: "Mushroom",
//       alias: "@toad",
//       image: "toad.png",
//     },
//   ];

//   for (const user of users) {
//     const imagePathFull = imagePath + user.image;
//     try {
//       const base64Image = await encodeImageToBase64(imagePathFull);
//       await userDao.register(
//         user.firstName,
//         user.lastName,
//         user.alias,
//         "password",
//         base64Image,
//         "png"
//       );
//     } catch (error) {
//       console.error(`Error encoding image for ${user.alias}:`, error);
//     }
//   }
// }

// // Add follow relationships for testing
// async function addFollowRelationships() {
//   const followPairs = [
//     ["@mario", "@luigi"],
//     ["@mario", "@peach"],
//     ["@mario", "@daisy"],
//     ["@mario", "@toad"],
//     ["@luigi", "@mario"],
//     ["@luigi", "@peach"],
//     ["@peach", "@daisy"],
//     ["@daisy", "@mario"],
//     ["@daisy", "@toad"],
//     ["@toad", "@mario"],
//   ];

//   for (const [follower, followee] of followPairs) {
//     try {
//       await followDao.follow(
//         { token: "token", timestamp: 0 },
//         follower,
//         followee
//       );
//     } catch (error) {
//       console.error(
//         `Error adding follow relationship from ${follower} to ${followee}:`,
//         error
//       );
//     }
//   }
// }

// // Create statuses for testing
// async function createStatuses() {
//   const users: (keyof typeof statuses)[] = [
//     "@mario",
//     "@luigi",
//     "@peach",
//     "@daisy",
//     "@toad",
//   ];
//   const statuses: {
//     [key: string]: {
//       post: string;
//       segments: {
//         text: string;
//         startPosition: number;
//         endPosition: number;
//         type: Type;
//       }[];
//     }[];
//   } = {
//     "@mario": [
//       {
//         post: "It's a me, Mario!",
//         segments: [
//           {
//             text: "It's a me, Mario!",
//             startPosition: 0,
//             endPosition: 16,
//             type: Type.text,
//           },
//         ],
//       },
//       {
//         post: "Post 0 0\n        My friend @luigi likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
//         segments: [
//           {
//             text: "Post 0 0\n        My friend ",
//             startPosition: 0,
//             endPosition: 28,
//             type: Type.text,
//           },
//           {
//             text: "@luigi",
//             startPosition: 28,
//             endPosition: 34,
//             type: Type.alias,
//           },
//           {
//             text: " likes this website: ",
//             startPosition: 34,
//             endPosition: 56,
//             type: Type.text,
//           },
//           {
//             text: "http://byu.edu",
//             startPosition: 56,
//             endPosition: 69,
//             type: Type.url,
//           },
//           {
//             text: ". Do you? \n        Or do you prefer this one: ",
//             startPosition: 69,
//             endPosition: 105,
//             type: Type.text,
//           },
//           {
//             text: "http://cs.byu.edu",
//             startPosition: 105,
//             endPosition: 120,
//             type: Type.url,
//           },
//           { text: "?", startPosition: 120, endPosition: 121, type: Type.text },
//         ],
//       },
//     ],
//     "@luigi": [
//       {
//         post: "Green is the best color!",
//         segments: [
//           {
//             text: "Green is the best color!",
//             startPosition: 0,
//             endPosition: 23,
//             type: Type.text,
//           },
//         ],
//       },
//       {
//         post: "Post 0 0\n        My friend @mario likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
//         segments: [
//           {
//             text: "Post 0 0\n        My friend ",
//             startPosition: 0,
//             endPosition: 28,
//             type: Type.text,
//           },
//           {
//             text: "@mario",
//             startPosition: 28,
//             endPosition: 34,
//             type: Type.alias,
//           },
//           {
//             text: " likes this website: ",
//             startPosition: 34,
//             endPosition: 56,
//             type: Type.text,
//           },
//           {
//             text: "http://byu.edu",
//             startPosition: 56,
//             endPosition: 69,
//             type: Type.url,
//           },
//           {
//             text: ". Do you? \n        Or do you prefer this one: ",
//             startPosition: 69,
//             endPosition: 105,
//             type: Type.text,
//           },
//           {
//             text: "http://cs.byu.edu",
//             startPosition: 105,
//             endPosition: 120,
//             type: Type.url,
//           },
//           { text: "?", startPosition: 120, endPosition: 121, type: Type.text },
//         ],
//       },
//     ],
//     "@peach": [
//       {
//         post: "I love cake",
//         segments: [
//           {
//             text: "I love cake",
//             startPosition: 0,
//             endPosition: 11,
//             type: Type.text,
//           },
//         ],
//       },
//       {
//         post: "Post 0 0\n        My friend @daisy likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
//         segments: [
//           {
//             text: "Post 0 0\n        My friend ",
//             startPosition: 0,
//             endPosition: 28,
//             type: Type.text,
//           },
//           {
//             text: "@daisy",
//             startPosition: 28,
//             endPosition: 35,
//             type: Type.alias,
//           },
//           {
//             text: " likes this website: ",
//             startPosition: 35,
//             endPosition: 57,
//             type: Type.text,
//           },
//           {
//             text: "http://byu.edu",
//             startPosition: 57,
//             endPosition: 70,
//             type: Type.url,
//           },
//           {
//             text: ". Do you? \n        Or do you prefer this one: ",
//             startPosition: 70,
//             endPosition: 106,
//             type: Type.text,
//           },
//           {
//             text: "http://cs.byu.edu",
//             startPosition: 106,
//             endPosition: 121,
//             type: Type.url,
//           },
//           { text: "?", startPosition: 121, endPosition: 122, type: Type.text },
//         ],
//       },
//     ],
//     "@daisy": [
//       {
//         post: "I love flowers",
//         segments: [
//           {
//             text: "I love flowers",
//             startPosition: 0,
//             endPosition: 13,
//             type: Type.text,
//           },
//         ],
//       },
//       {
//         post: "Post 0 0\n        My friend @peach likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
//         segments: [
//           {
//             text: "Post 0 0\n        My friend ",
//             startPosition: 0,
//             endPosition: 28,
//             type: Type.text,
//           },
//           {
//             text: "@peach",
//             startPosition: 28,
//             endPosition: 34,
//             type: Type.alias,
//           },
//           {
//             text: " likes this website: ",
//             startPosition: 34,
//             endPosition: 56,
//             type: Type.text,
//           },
//           {
//             text: "http://byu.edu",
//             startPosition: 56,
//             endPosition: 69,
//             type: Type.url,
//           },
//           {
//             text: ". Do you? \n        Or do you prefer this one: ",
//             startPosition: 69,
//             endPosition: 105,
//             type: Type.text,
//           },
//           {
//             text: "http://cs.byu.edu",
//             startPosition: 105,
//             endPosition: 120,
//             type: Type.url,
//           },
//           { text: "?", startPosition: 120, endPosition: 121, type: Type.text },
//         ],
//       },
//     ],
//     "@toad": [
//       {
//         post: "I love mushrooms",
//         segments: [
//           {
//             text: "I love mushrooms",
//             startPosition: 0,
//             endPosition: 15,
//             type: Type.text,
//           },
//         ],
//       },
//       {
//         post: "Post 0 0\n        My friend @mario likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?",
//         segments: [
//           {
//             text: "Post 0 0\n        My friend ",
//             startPosition: 0,
//             endPosition: 28,
//             type: Type.text,
//           },
//           {
//             text: "@mario",
//             startPosition: 28,
//             endPosition: 34,
//             type: Type.alias,
//           },
//           {
//             text: " likes this website: ",
//             startPosition: 34,
//             endPosition: 56,
//             type: Type.text,
//           },
//           {
//             text: "http://byu.edu",
//             startPosition: 56,
//             endPosition: 69,
//             type: Type.url,
//           },
//           {
//             text: ". Do you? \n        Or do you prefer this one: ",
//             startPosition: 69,
//             endPosition: 105,
//             type: Type.text,
//           },
//           {
//             text: "http://cs.byu.edu",
//             startPosition: 105,
//             endPosition: 120,
//             type: Type.url,
//           },
//           { text: "?", startPosition: 120, endPosition: 121, type: Type.text },
//         ],
//       },
//     ],
//   };

//   for (const alias of users) {
//     try {
//       const user = await userDao.getUser(alias as string);
//       for (const status of statuses[alias]) {
//         await statusDao.postStatus({ ...status, user, timestamp: Date.now() });
//       }
//     } catch (error) {
//       console.error(`Error creating statuses for ${alias}:`, error);
//     }
//   }
// }

// async function runTests() {
//   await createUsers();
//   await createStatuses();
//   await addFollowRelationships();
// }

// runTests();
