import { AuthTokenDto, UserDto } from "tweeter-shared";
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

export class UserDAODynamo implements IUserDAO {
  readonly userTableName = "user";
  readonly authTableName = "auth";
  readonly alias = "alias";
  readonly firstName = "first_name";
  readonly lastName = "last_name";
  readonly imageUrl = "image_url";
  readonly password = "password";

  //TODO: find a different way to access the fileDAOS3
  private fileDAOS3 = new FileDAOS3();

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  // TODO: handle image uploads other than png?
  // TODO: handle errors (invalid alias, duplicate alias, etc.)
  // TODO: implement authtoken generation and handling
  // TODO: add password hashing

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
    // S3DAO automatically handles images as png when uploaded.
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    //add alias and password to auth table
    const authCommand = {
      TableName: this.authTableName,
      Item: {
        [this.alias]: alias,
        [this.password]: password,
      },
    };

    await this.client.send(new PutCommand(authCommand));

    //upload image to S3
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

    return [
      {
        alias,
        firstName,
        lastName,
        imageUrl,
      },
      //TODO: implement auth token generation
      {
        token: "token",
        timestamp: 0,
      },
    ];
  }

  async login(
    alias: string,
    password: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const authCommand = {
      TableName: this.authTableName,
      Key: {
        [this.alias]: alias,
      },
    };

    const authResult = await this.client.send(new GetCommand(authCommand));

    if (
      authResult.Item === undefined ||
      authResult.Item[this.password] !== password
    ) {
      throw new Error("Invalid alias or password");
    } else {
      //if auth is successful, generate auth token and get user info
      //TODO: implement auth token generation
      const authToken = { token: "token", timestamp: 0 };
      const user = await this.getUser(authToken, alias);

      return [user, authToken];
    }
  }

  // TODO: validate auth token
  async getUser(authToken: AuthTokenDto, alias: string): Promise<UserDto> {
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

  async createUserTable() {
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
          ReadCapacityUnits: 3,
          WriteCapacityUnits: 3,
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
}
