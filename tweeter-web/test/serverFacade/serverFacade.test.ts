import {
  GetFollowCountRequest,
  PagedItemRequest,
  RegisterRequest,
  RegisterResponse,
  UserDto,
} from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("serverFacade", () => {
  let serverFacade: ServerFacade;
  const defaultRegisterAlias = "@allen";

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it("register a new user", async () => {
    const registerRequest: RegisterRequest = {
      firstName: "Test",
      lastName: "Testerson",
      alias: "@test",
      password: "password",
      userImageBytes: "bytes",
      imageFileExtension: "png",
    };
    const [newUser, authToken] = await serverFacade.register(registerRequest);
    expect(newUser).not.toBeNull();
    expect(newUser.alias).toBe(defaultRegisterAlias);
    expect(authToken).not.toBeNull();
  });

  it("get followers", async () => {
    const getFollowersRequest: PagedItemRequest<UserDto> = {
      authToken: { token: "asdf", timestamp: Date.now() },
      userAlias: defaultRegisterAlias,
      pageSize: 10,
      lastItem: null,
    };
    const [users, hasMore] = await serverFacade.loadMoreFollowers(
      getFollowersRequest
    );
    expect(users).not.toBeNull();
    expect(users.length).toBeGreaterThan(0);
  });

  it("get followers count", async () => {
    const followersCountRequest: GetFollowCountRequest = {
      token: "asdf",
      user: {
        firstName: "test",
        lastName: "testerson",
        alias: "@test",
        imageUrl: "example.com/image.png",
      },
    };
    const count = await serverFacade.getFollowerCount(followersCountRequest);
    expect(count).toBeGreaterThan(0);
  });
});
