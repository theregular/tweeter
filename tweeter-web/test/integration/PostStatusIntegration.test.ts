import { AuthToken, Status, User } from "tweeter-shared";
import { ServerFacade } from "tweeter-web/src/network/ServerFacade";
import { StatusService } from "tweeter-web/src/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "tweeter-web/src/presenter/PostStatusPresenter";
import { anything, instance, mock, verify, when, spy } from "ts-mockito";
import "isomorphic-fetch";

describe("PostStatus Integration Test", () => {
  const serverFacade = mock<ServerFacade>();
  const statusService = mock(StatusService);
  const mockPostStatusView = mock<PostStatusView>();

  // Create the presenter with mocked view instance
  const presenter = new PostStatusPresenter(instance(mockPostStatusView));

  // Set up statusService mock on the presenter
  const presenterSpy = spy(presenter);
  when(presenterSpy.statusService).thenReturn(instance(statusService));

  const authToken = new AuthToken("testToken", Date.now());
  const user = new User("Test", "User", "@testuser", "test.jpg");
  const post = "Integration test status";

  it("should post a status and verify it is appended to the user's story", async () => {
    // Mock login
    const loginRequest = { alias: "testuser", password: "password" };
    when(serverFacade.login(loginRequest)).thenReturn(
      Promise.resolve([user, authToken])
    );

    // Mock post status - use anything() matcher for timestamp flexibility
    when(statusService.postStatus(authToken, anything())).thenResolve();

    // Mock get story
    const storyStatus = new Status(post, user, Date.now());
    when(
      statusService.loadMoreStoryItems(authToken, user.alias, 10, null)
    ).thenResolve([[storyStatus], false]);

    // Login
    const [loggedInUser] = await instance(serverFacade).login(loginRequest);
    expect(loggedInUser).toEqual(user);

    // Post status through presenter
    await presenter.submitPost(
      { preventDefault: () => {} } as React.MouseEvent,
      authToken,
      user,
      post
    );

    // Verify post status was called with correct auth token and a status containing our post
    verify(statusService.postStatus(authToken, anything())).once();

    // Verify success message was displayed to user
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();

    // Verify story retrieval contains our post
    const [statuses, hasMore] = await instance(
      statusService
    ).loadMoreStoryItems(authToken, user.alias, 10, null);

    expect(statuses).toHaveLength(1);
    expect(statuses[0].post).toEqual(post);
    expect(statuses[0].user.alias).toEqual(user.alias);
  });
});
