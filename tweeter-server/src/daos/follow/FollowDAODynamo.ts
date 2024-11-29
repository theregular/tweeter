import { UserDto, AuthTokenDto } from "tweeter-shared";
import { IFollowDAO } from "./IFollowDAO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  BatchGetCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

//Handle AuthToken

export class FollowDAODynamo implements IFollowDAO {
  readonly followTableName = "follow";
  readonly indexName = "followee_index";
  readonly followerHandle = "follower_handle";
  readonly followeeHandle = "followee_handle";
  readonly followerName = "follower_name";
  readonly followeeName = "followee_name";
  readonly authToken = "auth_token";
  readonly userTableName = "user"; // Add user table name

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async getPageOfFollowees(
    authToken: AuthTokenDto,
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
            [this.authToken]: authToken,
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
          // Add other UserDto properties here
        } as UserDto;
      }
    );

    const lastKey = result.LastEvaluatedKey
      ? result.LastEvaluatedKey[this.followeeHandle]
      : undefined;

    return [followees, lastKey ? true : false];
  }

  async getPageOfFollowers(
    authToken: AuthTokenDto,
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
            [this.authToken]: authToken,
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
          // Add other UserDto properties here
        } as UserDto;
      }
    );

    const lastKey = result.LastEvaluatedKey
      ? result.LastEvaluatedKey[this.followerHandle]
      : undefined;

    return [followers, lastKey ? true : false];
  }

  async getFollowerCount(
    token: AuthTokenDto,
    user: UserDto | null
  ): Promise<number> {
    const params = {
      TableName: this.followTableName,
      IndexName: this.indexName,
      KeyConditionExpression: `${this.followeeHandle} = :followee_handle`,
      ExpressionAttributeValues: {
        ":followee_handle": user?.alias,
      },
    };

    const result = await this.client.send(new QueryCommand(params));

    if (result.Count === undefined) {
      throw new Error("Error getting follower count");
    }

    return result.Count;
  }

  async getFolloweeCount(
    token: AuthTokenDto,
    user: UserDto | null
  ): Promise<number> {
    const params = {
      TableName: this.followTableName,
      KeyConditionExpression: `${this.followerHandle} = :follower_handle`,
      ExpressionAttributeValues: {
        ":follower_handle": user?.alias,
      },
    };

    const result = await this.client.send(new QueryCommand(params));

    if (result.Count === undefined) {
      throw new Error("Error getting followee count");
    }

    return result.Count;
  }

  async follow(
    authToken: AuthTokenDto,
    alias: string,
    toFollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const params = {
      TableName: this.followTableName,
      Item: {
        [this.followerHandle]: alias,
        [this.followeeHandle]: toFollowAlias,
      },
    };

    await this.client.send(new PutCommand(params));

    // const followerCount = await this.getFollowerCount(authToken, null);
    // const followeeCount = await this.getFolloweeCount(authToken, null);

    const followerCount = 69;
    const followeeCount = 420;

    return [followerCount, followeeCount];
  }

  async unfollow(
    authToken: AuthTokenDto,
    alias: string,
    toUnfollowAlias: string
  ): Promise<[followerCount: number, followeeCount: number]> {
    const params = {
      TableName: this.followTableName,
      Key: {
        [this.followerHandle]: alias,
        [this.followeeHandle]: toUnfollowAlias,
      },
    };

    await this.client.send(new DeleteCommand(params));

    // const followerCount = await this.getFollowerCount(authToken, null);
    // const followeeCount = await this.getFolloweeCount(authToken, null);

    const followerCount = 69;
    const followeeCount = 420;

    return [followerCount, followeeCount];
  }

  async getIsFollowerStatus(
    authToken: AuthTokenDto,
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
}
