import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

import { AuthTokenDto, StatusDto, PostSegmentDto, Type } from "tweeter-shared";
import { UserDAODynamo } from "../user/UserDAODynamo";
import { IStatusDAO } from "./IStatusDAO";
export class StatusDAODynamo implements IStatusDAO {
  readonly storyTableName = "story";
  readonly feedTableName = "feed";
  readonly alias = "alias";
  readonly timestamp = "timestamp";
  readonly post = "post";
  readonly segments = "segments";
  private userDAO = new UserDAODynamo();

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  // all statuses posted by users that the given user follows, sorted from newest to oldest.

  async getFeedPage(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: CHANGE THIS
    return [[], false];
  }

  // all statuses posted by a given user, sorted from newest to oldest.

  async getStoryPage(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    //get the user
    try {
      const user = await this.userDAO.getUser(authToken, userAlias);
      // get all statuses from the given user

      const storyParams = {
        TableName: this.storyTableName,
        KeyConditionExpression: `${this.alias} = :alias`,
        ExpressionAttributeValues: {
          ":alias": { S: userAlias },
        },
        Limit: pageSize,
        ScanIndexForward: false,
        ExclusiveStartKey: lastItem?.timestamp
          ? {
              [this.alias]: { S: userAlias },
              [this.timestamp]: { N: lastItem.timestamp.toString() },
            }
          : undefined,
      };

      const storyResult = await this.client.send(new QueryCommand(storyParams));

      const statuses = storyResult.Items?.map((item) => {
        return {
          user: {
            //  TODO: implement fetch for user info
            alias: user.alias,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
          },
          post: item[this.post].S,
          // TODO: check if this is correct
          timestamp: parseInt(item[this.timestamp]?.N || "Error"),
          segments: (item[this.segments].L || []).map((segment) => {
            return {
              type: segment.M?.type?.S as Type,
              text: segment.M?.text?.S,
            } as PostSegmentDto;
          }),
        } as StatusDto;
      });

      const lastKey = storyResult.LastEvaluatedKey
        ? storyResult.LastEvaluatedKey[this.timestamp]
        : undefined;

      return [statuses || [], lastKey ? true : false];
    } catch (error) {
      throw new Error("User not found");
    }
  }

  async postStatus(
    authToken: AuthTokenDto,
    newStatus: StatusDto
  ): Promise<void> {
    const params = {
      TableName: this.storyTableName,
      Item: {
        [this.alias]: newStatus.user.alias,
        [this.timestamp]: newStatus.timestamp,
        [this.post]: newStatus.post,
        [this.segments]: newStatus.segments,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async deleteStoryTable(): Promise<void> {
    try {
      const deleteParams = {
        TableName: this.storyTableName,
      };
      await this.client.send(new DeleteTableCommand(deleteParams));
      console.log(this.storyTableName + " table deleted");
    } catch (error) {
      throw new Error("DynamoDB delete all failed with: " + error);
    }
  }

  async deleteFeedTable(): Promise<void> {
    try {
      const deleteParams = {
        TableName: this.feedTableName,
      };
      await this.client.send(new DeleteTableCommand(deleteParams));
      console.log(this.feedTableName + " table deleted");
    } catch (error) {
      throw new Error("DynamoDB delete all failed with: " + error);
    }
  }

  async createStoryTable(): Promise<void> {
    const command = new CreateTableCommand({
      TableName: this.storyTableName,
      AttributeDefinitions: [
        { AttributeName: this.alias, AttributeType: "S" }, // String
        { AttributeName: this.timestamp, AttributeType: "N" }, // Number
      ],
      KeySchema: [
        { AttributeName: this.alias, KeyType: "HASH" }, // Partition Key
        { AttributeName: this.timestamp, KeyType: "RANGE" }, // Sort Key
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: 3,
      },
      BillingMode: "PROVISIONED",
    });
    try {
      const result = await this.client.send(command);
      console.log(this.storyTableName + " table created");
    } catch (error) {
      console.error("Error creating table:", error);
    }
  }

  async createFeedTable(): Promise<void> {
    const command = new CreateTableCommand({
      TableName: this.feedTableName,
      AttributeDefinitions: [
        { AttributeName: "alias", AttributeType: "S" }, // String
        { AttributeName: "timestamp", AttributeType: "N" }, // Number
      ],
      KeySchema: [
        { AttributeName: "alias", KeyType: "HASH" }, // Partition Key
        { AttributeName: "timestamp", KeyType: "RANGE" }, // Sort Key
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: 3,
      },
      BillingMode: "PROVISIONED",
    });
    try {
      const result = await this.client.send(command);
      console.log(this.feedTableName + " table created");
    } catch (error) {
      console.error("Error creating table:", error);
    }
  }
}
