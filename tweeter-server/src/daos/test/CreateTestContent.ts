import { FollowDAODynamo } from "../follow/FollowDAODynamo";
import { StatusDAODynamo } from "../status/StatusDAODynamo";
import { UserDAODynamo } from "../user/UserDAODynamo";
import fs from "fs";
import { Type } from "tweeter-shared";

const userDao = new UserDAODynamo();
const followDao = new FollowDAODynamo();
const statusDao = new StatusDAODynamo();

//helper functions

function encodeImageToBase64(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString("base64"));
      }
    });
  });
}

//create users for testing

//mario
const marioImage = "./test_images/mario.png";
encodeImageToBase64(marioImage)
  .then((base64Image) => {
    userDao.register(
      "Mario",
      "Toadstool",
      "@mario",
      "password",
      base64Image,
      "png"
    );
  })
  .catch((error) => {
    console.error("Error encoding image:", error);
  });

//luigi
const luigiImage = "./test_images/luigi.png";
encodeImageToBase64(luigiImage)
  .then((base64Image) => {
    userDao.register(
      "Luigi",
      "Mario",
      "@luigi",
      "password",
      base64Image,
      "png"
    );
  })
  .catch((error) => {
    console.error("Error encoding image:", error);
  });

//peach
const peachImage = "./test_images/peach.png";
encodeImageToBase64(peachImage)
  .then((base64Image) => {
    userDao.register(
      "Peach",
      "Princess",
      "@peach",
      "password",
      base64Image,
      "png"
    );
  })
  .catch((error) => {
    console.error("Error encoding image:", error);
  });

//daisy
const daisyImage = "./test_images/daisy.png";
encodeImageToBase64(daisyImage)
  .then((base64Image) => {
    userDao.register(
      "Daisy",
      "Princess",
      "@daisy",
      "password",
      base64Image,
      "png"
    );
  })
  .catch((error) => {
    console.error("Error encoding image:", error);
  });

//toad
const toadImage = "./test_images/toad.png";
encodeImageToBase64(toadImage)
  .then((base64Image) => {
    userDao.register(
      "Toad",
      "Mushroom",
      "@toad",
      "password",
      base64Image,
      "png"
    );
  })
  .catch((error) => {
    console.error("Error encoding image:", error);
  });

//add follow relationships for testing
//TODO: add proper authtoken generation and handling
followDao.follow({ token: "token", timestamp: 0 }, "@mario", "@luigi");
followDao.follow({ token: "token", timestamp: 0 }, "@mario", "@peach");
followDao.follow({ token: "token", timestamp: 0 }, "@mario", "@daisy");
followDao.follow({ token: "token", timestamp: 0 }, "@mario", "@toad");
followDao.follow({ token: "token", timestamp: 0 }, "@luigi", "@mario");
followDao.follow({ token: "token", timestamp: 0 }, "@luigi", "@peach");
followDao.follow({ token: "token", timestamp: 0 }, "@peach", "@daisy");
followDao.follow({ token: "token", timestamp: 0 }, "@daisy", "@mario");
followDao.follow({ token: "token", timestamp: 0 }, "@daisy", "@toad");
followDao.follow({ token: "token", timestamp: 0 }, "@toad", "@mario");
