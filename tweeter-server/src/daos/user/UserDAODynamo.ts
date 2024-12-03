import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import { IUserDAO } from "./IUserDAO";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { FileDAOS3 } from "../file/FileDAOS3";

const saltRounds = 10;
const bcrypt = require("bcryptjs");

export class UserDAODynamo implements IUserDAO {
  readonly userTableName = "user";
  readonly authTableName = "auth";
  readonly passwordTableName = "password";
  readonly alias = "alias";
  readonly firstName = "first_name";
  readonly lastName = "last_name";
  readonly imageUrl = "image_url";
  readonly password = "password";
  readonly authToken = "auth_token";
  readonly authTokenTimestamp = "auth_token_timestamp";
  readonly indexName = "auth_token_index";

  //TODO: find a different way to access the fileDAOS3
  private fileDAOS3 = new FileDAOS3();

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  // TODO: handle image uploads other than png? and move to be within userService class
  // TODO: handle errors (invalid alias, duplicate alias, etc.)
  // TODO: implement authtoken generation and handling

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    // S3DAO automatically handles images as png when uploaded.
    imageFileExtension: string
  ): Promise<UserDto> {
    //hash password

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    //add alias and hashed password to password table
    const passwordCommand = {
      TableName: this.passwordTableName,
      Item: {
        [this.alias]: alias,
        [this.password]: hashedPassword,
      },
    };

    await this.client.send(new PutCommand(passwordCommand));

    //upload image to S3
    try {
      const imageUrl = await this.fileDAOS3.putImage(
        alias + "." + imageFileExtension,
        userImageBytes
      );
      //add user info to user table
      const userCommand = {
        TableName: this.userTableName,
        Item: {
          [this.alias]: alias,
          [this.firstName]: firstName,
          [this.lastName]: lastName,
          [this.imageUrl]: imageUrl,
        },
      };

      await this.client.send(new PutCommand(userCommand));

      return {
        firstName: firstName,
        lastName: lastName,
        alias: alias,
        imageUrl: imageUrl,
      };
    } catch (error) {
      throw new Error("Error uploading image to S3");
    }
  }

  async login(alias: string, password: string): Promise<UserDto> {
    //get hashed password from password table
    const passwordCommand = {
      TableName: this.passwordTableName,
      Key: {
        [this.alias]: alias,
      },
    };

    const passwordResult = await this.client.send(
      new GetCommand(passwordCommand)
    );

    //if no password is found or password is incorrect, throw error
    if (
      passwordResult.Item === undefined ||
      bcrypt.compare(password, passwordResult.Item[this.password]) === false
    ) {
      throw new Error("Invalid alias or password");
    }

    // TODO: move to service class
    const user = await this.getUser(alias);

    return user;
  }

  // TODO: validate auth token
  async getUser(alias: string): Promise<UserDto> {
    const params = {
      TableName: this.userTableName,
      Key: {
        [this.alias]: alias,
      },
    };

    const result = await this.client.send(new GetCommand(params));

    if (result.Item === undefined) {
      throw new Error(`No user found with alias ${alias}`);
    }

    return {
      alias: result.Item[this.alias],
      firstName: result.Item[this.firstName],
      lastName: result.Item[this.lastName],
      imageUrl: result.Item[this.imageUrl],
    };
  }

  async getUsers(
    authToken: AuthTokenDto,
    userAlias: string[]
  ): Promise<UserDto[]> {
    const params = {
      TableName: this.userTableName,
      FilterExpression: `${this.alias} IN (:aliases)`,
      ExpressionAttributeValues: {
        ":aliases": { SS: userAlias },
      },
    };

    const result = await this.client.send(new ScanCommand(params));

    if (result.Items === undefined) {
      throw new Error("Error getting users");
    }

    return result.Items.map((item) => {
      return {
        firstName: item[this.firstName]?.S || "",
        lastName: item[this.lastName]?.S || "",
        alias: item[this.alias]?.S || "",
        imageUrl: item[this.imageUrl]?.S || "",
      };
    });
  }

  async deleteUserTable() {
    try {
      const params = {
        TableName: this.userTableName,
      };

      await this.client.send(new DeleteTableCommand(params));
      console.log(this.userTableName + " table deleted");
    } catch (error) {
      console.error("Error creating table:", error);
      throw new Error(`Failed to delete table ${this.userTableName}`);
    }
  }

  async deletePasswordTable() {
    try {
      const params = {
        TableName: this.passwordTableName,
      };

      await this.client.send(new DeleteTableCommand(params));
      console.log(this.passwordTableName + " table deleted");
    } catch (error) {
      console.error("Error creating table:", error);
      throw new Error(`Failed to delete table ${this.passwordTableName}`);
    }
  }

  async createUserTable(readUnits: number, writeUnits: number) {
    try {
      const command = new CreateTableCommand({
        TableName: this.userTableName,
        AttributeDefinitions: [
          { AttributeName: this.alias, AttributeType: "S" }, // String
        ],
        KeySchema: [
          { AttributeName: this.alias, KeyType: "HASH" }, // Partition Key
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: readUnits,
          WriteCapacityUnits: writeUnits,
        },
        BillingMode: "PROVISIONED",
      });

      await this.client.send(command);
      console.log(this.userTableName + " table created");
    } catch (error) {
      console.error("Error creating table:", error);
      throw new Error(`Failed to create table ${this.userTableName}`);
    }
  }

  async createPasswordTable(readUnits: number, writeUnits: number) {
    try {
      const command = new CreateTableCommand({
        TableName: this.passwordTableName,
        KeySchema: [
          { AttributeName: this.alias, KeyType: "HASH" }, // Partition Key
        ],
        AttributeDefinitions: [
          { AttributeName: this.alias, AttributeType: "S" }, // String
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 3,
          WriteCapacityUnits: 3,
        },
        BillingMode: "PROVISIONED",
      });

      await this.client.send(command);
      console.log(this.passwordTableName + " table created");
    } catch (error) {
      console.error("Error creating table:", error);
      throw new Error(`Failed to create table ${this.passwordTableName}`);
    }
  }
}
