import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBClient,
  QueryCommand,
  TableAlreadyExistsException,
} from "@aws-sdk/client-dynamodb";

import { AuthTokenDto, StatusDto, PostSegmentDto, Type } from "tweeter-shared";
import { UserDAODynamo } from "../user/UserDAODynamo";
import { IStatusDAO } from "./IStatusDAO";
export class StatusDAODynamo implements IStatusDAO {
  readonly statusTableName = "status";
  readonly alias = "alias";
  readonly post = "post";
  readonly timestamp = "timestamp";
  readonly segments = "segments";
  // private userDAO = new UserDAODynamo();

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
    // get all statuses from a given user

    const params = {
      TableName: this.statusTableName,
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

    const result = await this.client.send(new QueryCommand(params));

    const statuses = result.Items?.map((item) => {
      return {
        user: {
          //  TODO: implement fetch for user info
          alias: userAlias,
          firstName: "implement fetch",
          lastName: "for user info",
          imageUrl: "test",
        },
        post: item[this.post].S,
        // TODO: check if this is correct
        timestamp: parseInt(item[this.timestamp]?.N || "0"),
        segments: (item[this.segments].L || []).map((segment) => {
          return {
            type: segment.M?.type?.S as Type,
            text: segment.M?.text?.S,
          } as PostSegmentDto;
        }),
      } as StatusDto;
    });

    const lastKey = result.LastEvaluatedKey
      ? result.LastEvaluatedKey[this.timestamp]
      : undefined;

    return [statuses || [], lastKey ? true : false];
  }

  async postStatus(
    authToken: AuthTokenDto,
    newStatus: StatusDto
  ): Promise<void> {
    const params = {
      TableName: this.statusTableName,
      Item: {
        [this.alias]: newStatus.user.alias,
        [this.timestamp]: newStatus.timestamp,
        [this.post]: newStatus.post,
        [this.segments]: newStatus.segments,
      },
    };
    await this.client.send(new PutCommand(params));
  }
}
