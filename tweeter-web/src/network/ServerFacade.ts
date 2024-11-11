import {
  AuthToken,
  FollowRequest,
  FollowResponse,
  GetFollowCountRequest,
  GetFollowCountResponse,
  GetIsFollowerStatusRequest,
  GetIsFollowerStatusResponse,
  GetUserRequest,
  GetUserResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterRequest,
  RegisterResponse,
  Status,
  StatusDto,
  StatusRequest,
  TweeterRequest,
  TweeterResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL: string =
    "https://p60gxurbu8.execute-api.us-west-2.amazonaws.com/dev";
  private communicator: ClientCommunicator;

  public constructor() {
    this.communicator = new ClientCommunicator(this.SERVER_URL);
  }

  private async makeGetRequestAndError<
    T extends TweeterRequest,
    U extends TweeterResponse,
    V,
    X
  >(
    request: T,
    endpoint: string,
    getItems: (response: U) => V | null,
    getReturnItems: (response: U, items: V) => X,
    errorMessage: string
  ) {
    const response = await this.communicator.doPost<T, U>(request, endpoint);
    const items: V | null = getItems(response);
    if (response.success) {
      if (items === null) {
        throw new Error(errorMessage);
      } else {
        return getReturnItems(response, items);
      }
    } else {
      console.error(response);
      throw new Error(response.message ? response.message : undefined);
    }
  }

  private async makeSimpleRequestAndError<
    T extends TweeterRequest,
    U extends TweeterResponse
  >(request: T, endpoint: string): Promise<void> {
    const response = await this.communicator.doPost<T, U>(request, endpoint);
    if (!response.success) {
      console.error(response);
      throw new Error(response.message ? response.message : undefined);
    }
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    return await this.makeGetRequestAndError<
      LoginRequest,
      LoginResponse,
      User,
      [User, AuthToken]
    >(
      request,
      "/login",
      (response: LoginResponse) => {
        const userDto = response.user;
        const user: User | null = userDto
          ? new User(
              userDto.firstName,
              userDto.lastName,
              userDto.alias,
              userDto.imageUrl
            )
          : null;
        return user;
      },
      (response: LoginResponse, items: User) => {
        return [items, new AuthToken(response.token, 1)];
      },
      "Invalid alias or password"
    );
  }

  public async logout(request: LogoutRequest): Promise<void> {
    await this.makeSimpleRequestAndError(request, "/logout");
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    return await this.makeGetRequestAndError<
      RegisterRequest,
      RegisterResponse,
      User,
      [User, AuthToken]
    >(
      request,
      "/register",
      (response: RegisterResponse) => {
        const userDto = response.user;
        const user: User | null = userDto
          ? new User(
              userDto.firstName,
              userDto.lastName,
              userDto.alias,
              userDto.imageUrl
            )
          : null;
        return user;
      },
      (response: RegisterResponse, items: User) => {
        return [
          items,
          new AuthToken(response.authToken.token, response.authToken.timestamp),
        ];
      },
      "Could not register user"
    );
  }

  public async getIsFollowerStatus(
    request: GetIsFollowerStatusRequest
  ): Promise<boolean> {
    return await this.makeGetRequestAndError<
      GetIsFollowerStatusRequest,
      GetIsFollowerStatusResponse,
      boolean,
      boolean
    >(
      request,
      "/is-follower",
      (response: GetIsFollowerStatusResponse) => {
        return response.status;
      },
      (response: GetIsFollowerStatusResponse, items: boolean) => {
        return items;
      },
      "Could not obtain follower status"
    );
  }

  public async getFollowerCount(
    request: GetFollowCountRequest
  ): Promise<number> {
    return await this.makeGetRequestAndError<
      GetFollowCountRequest,
      GetFollowCountResponse,
      number,
      number
    >(
      request,
      "/follower-count",
      (response: GetFollowCountResponse) => {
        return response.count;
      },
      (response: GetFollowCountResponse, items: number) => {
        return items;
      },
      "Could not obtain number of followers"
    );
  }

  public async getFolloweeCount(
    request: GetFollowCountRequest
  ): Promise<number> {
    return await this.makeGetRequestAndError<
      GetFollowCountRequest,
      GetFollowCountResponse,
      number,
      number
    >(
      request,
      "/followee-count",
      (response: GetFollowCountResponse) => {
        return response.count;
      },
      (response: GetFollowCountResponse, items: number) => {
        return items;
      },
      "Could not obtain number of followees"
    );
  }

  public async getUser(request: GetUserRequest): Promise<User> {
    return await this.makeGetRequestAndError<
      GetUserRequest,
      GetUserResponse,
      User,
      User
    >(
      request,
      "/user",
      (response: GetUserResponse) => {
        const userDto = response.user;
        const user: User | null = userDto
          ? new User(
              userDto.firstName,
              userDto.lastName,
              userDto.alias,
              userDto.imageUrl
            )
          : null;
        return user;
      },
      (response: GetUserResponse, items: User) => {
        return items;
      },
      "No user found"
    );
  }

  public async loadMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return await this.makeGetRequestAndError<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>,
      User[],
      [User[], boolean]
    >(
      request,
      "/followers",
      (response: PagedItemResponse<UserDto>) => {
        return response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
      },
      (response: PagedItemResponse<UserDto>, items: User[]) => {
        return [items, response.hasMore];
      },
      "No followers found"
    );
  }

  public async loadMoreFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    return await this.makeGetRequestAndError<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>,
      User[],
      [User[], boolean]
    >(
      request,
      "/followees",
      (response: PagedItemResponse<UserDto>) => {
        return response.success && response.items
          ? response.items.map((dto) => User.fromDto(dto) as User)
          : null;
      },
      (response: PagedItemResponse<UserDto>, items: User[]) => {
        return [items, response.hasMore];
      },
      "No followees found"
    );
  }

  public async follow(request: FollowRequest): Promise<[number, number]> {
    return await this.makeGetRequestAndError<
      FollowRequest,
      FollowResponse,
      [number, number],
      [number, number]
    >(
      request,
      "/follow",
      (response: FollowResponse) => {
        return [response.followerCount, response.followeeCount];
      },
      (response: FollowResponse, items: [number, number]) => {
        return items;
      },
      "Invalid response from server"
    );
  }

  public async unfollow(request: FollowRequest): Promise<[number, number]> {
    return await this.makeGetRequestAndError<
      FollowRequest,
      FollowResponse,
      [number, number],
      [number, number]
    >(
      request,
      "/unfollow",
      (response: FollowResponse) => {
        return [response.followerCount, response.followeeCount];
      },
      (response: FollowResponse, items: [number, number]) => {
        return items;
      },
      "Invalid response from server"
    );
  }

  public async loadMoreStoryItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    return await this.makeGetRequestAndError<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>,
      Status[],
      [Status[], boolean]
    >(
      request,
      "/story-items",
      (response: PagedItemResponse<StatusDto>) => {
        return response.success && response.items
          ? response.items.map((dto) => Status.fromDto(dto) as Status)
          : null;
      },
      (response: PagedItemResponse<StatusDto>, items: Status[]) => {
        return [items, response.hasMore];
      },
      "No story items found"
    );
  }

  public async loadMoreFeedItems(
    request: StatusRequest
  ): Promise<[Status[], boolean]> {
    return await this.makeGetRequestAndError<
      StatusRequest,
      PagedItemResponse<StatusDto>,
      Status[],
      [Status[], boolean]
    >(
      request,
      "/feed-items",
      (response: PagedItemResponse<StatusDto>) => {
        return response.success && response.items
          ? response.items.map((dto) => Status.fromDto(dto) as Status)
          : null;
      },
      (response: PagedItemResponse<StatusDto>, items: Status[]) => {
        return [items, response.hasMore];
      },
      "No feed items found"
    );
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    await this.makeSimpleRequestAndError(request, "/post");
  }
}
