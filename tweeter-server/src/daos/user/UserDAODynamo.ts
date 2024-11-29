import { AuthTokenDto, UserDto } from "tweeter-shared";
import { IUserDAO } from "./IUserDAO";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class UserDAODynamo implements IUserDAO {
  readonly userTableName = "user";
  readonly authTableName = "auth";
  readonly alias = "alias";
  readonly firstName = "first_name";
  readonly lastName = "last_name";
  readonly password = "password";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  // TODO: handle image uploads
  // TODO: handle errors (invalid alias, duplicate alias, etc.)
  // TODO: implement authtoken generation and handling
  // TODO: add password hashing

  async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: string,
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

    //add user info to user table
    const userCommand = {
      TableName: this.userTableName,
      Item: {
        [this.alias]: alias,
        [this.firstName]: firstName,
        [this.lastName]: lastName,
      },
    };

    await this.client.send(new PutCommand(userCommand));

    return [
      {
        alias,
        firstName,
        lastName,
        imageUrl: "TODO: implement profile image",
      },
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
      imageUrl: "TODO: implement profile image",
    };
  }
}
