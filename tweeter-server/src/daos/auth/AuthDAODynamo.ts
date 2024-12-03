import { AuthToken, AuthTokenDto, UserDto } from "tweeter-shared";
import { IAuthDAO } from "./IAuthDAO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

const expirationTime = 1000 * 60 * 60; // 1 hour

export class AuthDAODynamo implements IAuthDAO {
  readonly authTableName = "auth";
  readonly authToken = "auth_token";
  readonly authTokenTimestamp = "auth_token_timestamp";
  readonly indexName = "auth_token_index";
  readonly alias = "alias";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  private async checkAuthTokenExpiration(
    token: AuthTokenDto
  ): Promise<boolean> {
    //check if token is expired

    const currentTime = Date.now();

    if (currentTime - token.timestamp > expirationTime) {
      console.log("Token expired");
      //delete expired token
      await this.deleteAuthToken(token);
      return false;
    } else {
      return true;
    }
  }

  async generateAuthToken(alias: string): Promise<AuthTokenDto> {
    //generate auth token and convert to dto
    const generatedtoken = AuthToken.Generate().dto;

    //add auth token to table
    const authParams = {
      TableName: this.authTableName,
      Item: {
        [this.authToken]: generatedtoken.token,
        [this.authTokenTimestamp]: generatedtoken.timestamp,
        [this.alias]: alias,
      },
    };

    try {
      await this.client.send(new PutCommand(authParams));
    } catch (error) {
      throw new Error("Failed to generate auth token");
    }

    return generatedtoken;
  }

  async verifyAuthToken(token: AuthTokenDto): Promise<AuthTokenDto | null> {
    //get auth token from table
    const authParams = {
      TableName: this.authTableName,
      Key: {
        [this.authToken]: token.token,
      },
    };

    const authResponse = await this.client.send(new GetCommand(authParams));

    if (authResponse.Item === undefined) {
      return null;
    }

    //check if token is expired

    const isTokenValid = await this.checkAuthTokenExpiration(token);

    if (!isTokenValid) {
      return null;
    }

    return {
      token: authResponse.Item[this.authToken],
      timestamp: authResponse.Item[this.authTokenTimestamp],
    };
  }

  async deleteAuthToken(token: AuthTokenDto): Promise<void> {
    //delete auth token from table
    const authParams = {
      TableName: this.authTableName,
      Key: {
        [this.authToken]: token.token,
      },
    };

    try {
      await this.client.send(new DeleteCommand(authParams));
    } catch (error) {
      throw new Error("Failed to delete auth token");
    }
  }

  async getAliasFromAuthToken(token: AuthTokenDto): Promise<string | null> {
    const isTokenValid = await this.checkAuthTokenExpiration(token);

    if (!isTokenValid) {
      return null;
    }

    const authParams = {
      TableName: this.authTableName,
      Key: {
        [this.authToken]: token.token,
      },
    };

    const authResponse = await this.client.send(new GetCommand(authParams));

    if (authResponse.Item === undefined) {
      return null;
    }

    return authResponse.Item[this.alias];
  }

  async deleteAuthTable() {
    try {
      const params = {
        TableName: this.authTableName,
      };

      await this.client.send(new DeleteTableCommand(params));
      console.log(this.authTableName + " table deleted");
    } catch (error) {
      console.error("Error creating table:", error);
      throw new Error(`Failed to delete table ${this.authTableName}`);
    }
  }

  async createAuthTable(readUnits: number, writeUnits: number) {
    try {
      const command = new CreateTableCommand({
        TableName: this.authTableName,
        KeySchema: [
          { AttributeName: this.authToken, KeyType: "HASH" }, // Partition Key
        ],
        AttributeDefinitions: [
          { AttributeName: this.authToken, AttributeType: "S" }, // String
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: readUnits,
          WriteCapacityUnits: writeUnits,
        },
        BillingMode: "PROVISIONED",
      });

      await this.client.send(command);
      console.log(this.authTableName + " table created");
    } catch (error) {
      console.error("Error creating table:", error);
      throw new Error(`Failed to create table ${this.authTableName}`);
    }
  }
}