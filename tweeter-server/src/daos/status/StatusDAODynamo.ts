import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

import { AuthTokenDto, StatusDto, PostSegmentDto, Type } from "tweeter-shared";
import { UserDAODynamo } from "../user/UserDAODynamo";
export class StatusDAODynamo {
  readonly statusTableName = "status";
  readonly alias = "alias";
  readonly post = "post";
  readonly timestamp = "timestamp";
  readonly segments = "segments";
  private userDAO = new UserDAODynamo();

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async loadMoreStoryItems(
    authToken: AuthTokenDto,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    //get status info

    const params = {
      TableName: this.statusTableName,
      KeyConditionExpression: `${this.alias} = :alias`,
      ExpressionAttributeValues: {
        ":alias": { S: userAlias },
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem?.user.alias
        ? {
            [this.alias]: { S: userAlias },
            [this.timestamp]: { N: lastItem.timestamp.toString() },
          }
        : undefined,
    };

    const statusResult = await this.client.send(new QueryCommand(params));

    const statusItems = statusResult.Items || [];

    //get user info for each status

    const userAliases = statusItems.map((item) => item[this.alias].S);
    const filteredUserAliases = userAliases.filter(
      (alias): alias is string => alias !== undefined
    );
    const users = await this.userDAO.getUsers(authToken, filteredUserAliases);

    //map status items to status dto

    const statusDtos = statusItems.map((item) => {
      const user = users.find((user) => user.alias === item[this.alias].S);
      return {
        user: user!,
        post: item[this.post].S || "",
        timestamp: parseInt(item[this.timestamp].N || "0"),
        segments:
          item[this.segments].L?.map((segment) => ({
            text: segment.M?.text.S || "",
            startPosition: segment.M?.startPosition.N
              ? parseInt(segment.M.startPosition.N)
              : 0,
            endPosition: segment.M?.endPosition.N
              ? parseInt(segment.M.endPosition.N)
              : 0,
            type: segment.M?.type.S as Type,
          })) || [],
      };
    });

    const lastKey = statusResult.LastEvaluatedKey
      ? statusResult.LastEvaluatedKey[this.timestamp].N
      : undefined;

    return [statusDtos, lastKey !== undefined];
  }
}
