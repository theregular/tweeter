import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import { IUserDAO } from "./IUserDAO";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
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
  //user table
  readonly userTableName = "user2";
  readonly alias = "alias";
  readonly firstName = "first_name";
  readonly lastName = "last_name";
  readonly imageUrl = "image_url";
  private readonly followeeCountAttribute = "followee_count";
  private readonly followerCountAttribute = "follower_count";

  //password table
  readonly passwordTableName = "password2";
  readonly password = "password";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  // TODO: handle image uploads other than png? and move to be within userService class
  // TODO: handle errors (invalid alias, duplicate alias, etc.)
  // TODO: implement authtoken generation and handling

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
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

    //add user info to user table
    const userCommand = {
      TableName: this.userTableName,
      Item: {
        [this.alias]: alias,
        [this.firstName]: firstName,
        [this.lastName]: lastName,
        [this.imageUrl]: imageUrl,
        [this.followeeCountAttribute]: 0,
        [this.followerCountAttribute]: 0,
      },
    };

    await this.client.send(new PutCommand(userCommand));

    //return User DTO
    return {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      imageUrl: imageUrl,
    };
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
    if (passwordResult.Item === undefined) {
      throw new Error("Invalid alias or password");
    } else {
      const isMatch = await bcrypt.compare(
        password,
        passwordResult.Item[this.password]
      );
      if (!isMatch) {
        throw new Error("Invalid alias or password");
      }
      const user = await this.getUser(alias);

      return user;
    }
  }

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

  async getFolloweeCount(alias: string): Promise<number> {
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

    return result.Item[this.followeeCountAttribute];
  }

  async getFollowerCount(alias: string): Promise<number> {
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

    return result.Item[this.followerCountAttribute];
  }

  updateFolloweeCount(alias: string, count: number): Promise<void> {
    return this.updateCount(alias, this.followeeCountAttribute, count);
  }

  updateFollowerCount(alias: string, count: number): Promise<void> {
    return this.updateCount(alias, this.followerCountAttribute, count);
  }

  private async updateCount(
    alias: string,
    attribute: string,
    count: number
  ): Promise<void> {
    const params = {
      TableName: this.userTableName,
      Key: {
        [this.alias]: alias,
      },
      UpdateExpression: `ADD ${attribute} :count`,
      ExpressionAttributeValues: {
        ":count": count,
      },
    };

    await this.client.send(new UpdateCommand(params));
  }

  // TABLE GENERATE AND DELETE FUNCTIONS

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
