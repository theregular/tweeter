import {
  UserDto,
  AuthTokenDto,
  PostSegmentDto,
  StatusDto,
  Type,
} from "tweeter-shared";
import { IFollowDAO } from "./IFollowDAO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  BatchGetCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

//Handle AuthToken

export class FollowDAODynamo implements IFollowDAO {
  readonly followTableName = "follow2";
  readonly indexName = "followee_index";
  readonly followerHandle = "follower_handle";
  readonly followeeHandle = "followee_handle";
  readonly followerName = "follower_name";
  readonly followeeName = "followee_name";
  readonly userTableName = "user2";

  //story & feed table stuff
  readonly storyTableName = "story";
  readonly feedTableName = "feed2";
  readonly alias = "alias";
  readonly posterInfo = "poster_info";
  readonly posterAlias = "poster_alias";
  readonly timestamp = "timestamp";
  readonly post = "post";
  readonly segments = "segments";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getPageOfFollowees(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params = {
      TableName: this.followTableName,
      KeyConditionExpression: `${this.followerHandle} = :follower_handle`,
      ExpressionAttributeValues: {
        ":follower_handle": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem?.alias
        ? {
            [this.followerHandle]: userAlias,
            [this.followeeHandle]: lastItem.alias,
          }
        : undefined,
    };

    const result = await this.client.send(new QueryCommand(params));

    const followeeAliases =
      result.Items?.map((item) => item[this.followeeHandle]) || [];

    if (followeeAliases.length === 0) {
      return [[], false];
    }

    const userParams = {
      RequestItems: {
        [this.userTableName]: {
          Keys: followeeAliases.map((alias) => ({ alias })),
        },
      },
    };

    const userResult = await this.client.send(new BatchGetCommand(userParams));

    const followees = (userResult.Responses?.[this.userTableName] || []).map(
      (item) => {
        return {
          alias: item.alias,
          firstName: item.first_name,
          lastName: item.last_name,
          imageUrl: item.image_url,
        } as UserDto;
      }
    );

    const lastKey = result.LastEvaluatedKey
      ? result.LastEvaluatedKey[this.followeeHandle]
      : undefined;

    return [followees, lastKey ? true : false];
  }

  async getPageOfFollowers(
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const params = {
      TableName: this.followTableName,
      IndexName: this.indexName,
      KeyConditionExpression: `${this.followeeHandle} = :followee_handle`,
      ExpressionAttributeValues: {
        ":followee_handle": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem?.alias
        ? {
            [this.followeeHandle]: userAlias,
            [this.followerHandle]: lastItem.alias,
          }
        : undefined,
    };

    const result = await this.client.send(new QueryCommand(params));

    const followerAliases =
      result.Items?.map((item) => item[this.followerHandle]) || [];

    if (followerAliases.length === 0) {
      return [[], false];
    }

    const userParams = {
      RequestItems: {
        [this.userTableName]: {
          Keys: followerAliases.map((alias) => ({ alias })),
        },
      },
    };

    const userResult = await this.client.send(new BatchGetCommand(userParams));

    const followers = (userResult.Responses?.[this.userTableName] || []).map(
      (item) => {
        return {
          alias: item.alias,
          firstName: item.first_name,
          lastName: item.last_name,
          imageUrl: item.image_url,
        } as UserDto;
      }
    );

    const lastKey = result.LastEvaluatedKey
      ? result.LastEvaluatedKey[this.followerHandle]
      : undefined;

    return [followers, lastKey ? true : false];
  }

  async getAllFollowerAliases(userAlias: string): Promise<string[]> {
    const params = {
      TableName: this.followTableName,
      IndexName: this.indexName,
      KeyConditionExpression: `${this.followeeHandle} = :followee_handle`,
      ExpressionAttributeValues: {
        ":followee_handle": userAlias,
      },
    };

    const result = await this.client.send(new QueryCommand(params));

    return result.Items?.map((item) => item[this.followerHandle]) || [];
  }

  // async getFollowerCount(alias: string): Promise<number> {
  //   const params = {
  //     TableName: this.followTableName,
  //     IndexName: this.indexName,
  //     KeyConditionExpression: `${this.followeeHandle} = :followee_handle`,
  //     ExpressionAttributeValues: {
  //       ":followee_handle": alias,
  //     },
  //   };

  //   const result = await this.client.send(new QueryCommand(params));

  //   if (result.Count === undefined) {
  //     throw new Error("Error getting follower count");
  //   }

  //   return result.Count;
  // }

  // async getFolloweeCount(alias: string): Promise<number> {
  //   const params = {
  //     TableName: this.followTableName,
  //     KeyConditionExpression: `${this.followerHandle} = :follower_handle`,
  //     ExpressionAttributeValues: {
  //       ":follower_handle": alias,
  //     },
  //   };

  //   const result = await this.client.send(new QueryCommand(params));

  //   if (result.Count === undefined) {
  //     throw new Error("Error getting followee count");
  //   }

  //   return result.Count;
  // }

  async follow(alias: string, toFollowAlias: string): Promise<void> {
    try {
      // update follow relationship
      const followParams = {
        TableName: this.followTableName,
        Item: {
          [this.followerHandle]: alias,
          [this.followeeHandle]: toFollowAlias,
        },
      };

      await this.client.send(new PutCommand(followParams));
      // console.log("Follow relationship updated successfully");
    } catch (error) {
      console.error("Error updating follow relationship:", error);
    }

    let storyStatuses: StatusDto[] = [];
    try {
      // get corresponding followed user's posts from story so we can add them into the feed table
      const storyParams = {
        TableName: this.storyTableName,
        KeyConditionExpression: `${this.alias} = :alias`,
        ExpressionAttributeValues: {
          ":alias": toFollowAlias,
        },
        ScanIndexForward: false,
      };

      const storyResult = await this.client.send(new QueryCommand(storyParams));
      // console.log("Story fetched successfully");

      storyStatuses =
        storyResult.Items?.map((item) => {
          return {
            user: {
              alias: item[this.posterInfo].alias,
              firstName: item[this.posterInfo].firstName,
              lastName: item[this.posterInfo].lastName,
              imageUrl: item[this.posterInfo].imageUrl,
            },
            post: item[this.post],
            timestamp: parseInt(item[this.timestamp] || "Error"),
            segments: (item[this.segments] || []).map((segment: any) => {
              return {
                type: segment.type as Type,
                text: segment.text,
              } as PostSegmentDto;
            }),
          } as StatusDto;
        }) || [];

      // console.log(storyStatuses);
    } catch (error) {
      console.error("Error fetching story:", error);
    }

    try {
      // add followed users posts into the feed table
      const feedWriteRequests = storyStatuses.map((status) => ({
        PutRequest: {
          Item: {
            [this.alias]: alias,
            [this.timestamp]: status.timestamp,
            [this.posterAlias]: status.user.alias,
            [this.posterInfo]: status.user,
            [this.post]: status.post,
            [this.segments]: status.segments,
          },
        },
      }));

      if (feedWriteRequests.length > 0) {
        const batchWriteParams = {
          RequestItems: {
            [this.feedTableName]: feedWriteRequests,
          },
        };

        await this.client.send(new BatchWriteCommand(batchWriteParams));
        // console.log("Feed table updated successfully");
      }
    } catch (error) {
      console.error("Error updating feed table:", error);
    }

    // const followerCount = await this.getFollowerCount(alias);
    // const followeeCount = await this.getFolloweeCount(alias);

    // return [followerCount, followeeCount];
  }

  async unfollow(alias: string, toUnfollowAlias: string): Promise<void> {
    // update follow relationship
    const followParams = {
      TableName: this.followTableName,
      Key: {
        [this.followerHandle]: alias,
        [this.followeeHandle]: toUnfollowAlias,
      },
    };

    await this.client.send(new DeleteCommand(followParams));

    // remove unfollowed user's posts from the feed table

    // get the feed of the user that's logged in

    const feedParams = {
      TableName: this.feedTableName,
      KeyConditionExpression: `${this.alias} = :alias`,
      ExpressionAttributeValues: {
        ":alias": alias,
      },
    };

    const feedResult = await this.client.send(new QueryCommand(feedParams));

    // get the keys of the posts that were posted by the user that was unfollowed

    const postKeys = feedResult.Items?.filter(
      (item) => item[this.posterAlias] === toUnfollowAlias
    );

    // remove the posts from the feed table

    const feedWriteRequests = postKeys?.map((item) => ({
      DeleteRequest: {
        Key: {
          [this.alias]: alias,
          [this.timestamp]: item[this.timestamp],
        },
      },
    }));

    if (feedWriteRequests?.length) {
      const batchWriteParams = {
        RequestItems: {
          [this.feedTableName]: feedWriteRequests,
        },
      };

      await this.client.send(new BatchWriteCommand(batchWriteParams));
    }

    // const followerCount = await this.getFollowerCount(alias);
    // const followeeCount = await this.getFolloweeCount(alias);

    // return [followerCount, followeeCount];
  }

  async getIsFollowerStatus(
    user: UserDto,
    selectedUser: UserDto
  ): Promise<boolean> {
    const params = {
      TableName: this.followTableName,
      Key: {
        [this.followerHandle]: user.alias,
        [this.followeeHandle]: selectedUser.alias,
      },
    };

    const result = await this.client.send(new GetCommand(params));

    return result.Item !== undefined;
  }

  async deleteFollowTable(): Promise<void> {
    try {
      const deleteParams = {
        TableName: this.followTableName,
      };
      await this.client.send(new DeleteTableCommand(deleteParams));
      console.log(this.followTableName + " table deleted");
    } catch (error) {
      throw new Error("DynamoDB delete all failed with: " + error);
    }
  }

  async createFollowTable(
    readUnits: number,
    writeUnits: number
  ): Promise<void> {
    const command = new CreateTableCommand({
      TableName: this.followTableName,
      KeySchema: [
        { AttributeName: this.followerHandle, KeyType: "HASH" },
        { AttributeName: this.followeeHandle, KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: this.followerHandle, AttributeType: "S" },
        { AttributeName: this.followeeHandle, AttributeType: "S" },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: readUnits,
        WriteCapacityUnits: writeUnits,
      },
      BillingMode: "PROVISIONED",
      GlobalSecondaryIndexes: [
        {
          IndexName: this.indexName, // Name of the index
          KeySchema: [
            { AttributeName: this.followeeHandle, KeyType: "HASH" }, // GSI Partition key
            { AttributeName: this.followerHandle, KeyType: "RANGE" }, // GSI Sort key (optional)
          ],
          Projection: {
            ProjectionType: "ALL", // Include all attributes in the index
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: readUnits, // GSI read capacity
            WriteCapacityUnits: writeUnits, // GSI write capacity
          },
        },
      ],
    });

    try {
      await this.client.send(command);
      console.log(this.followTableName + " table created");
    } catch (error) {
      throw new Error("DynamoDB create failed with: " + error);
    }
  }
}
