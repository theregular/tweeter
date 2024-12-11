import { AuthToken, Status, User } from "tweeter-shared";
import { ServerFacade } from "tweeter-web/src/network/ServerFacade";
import {
  PostStatusPresenter,
  PostStatusView,
} from "tweeter-web/src/presenter/PostStatusPresenter";
import { instance, mock, verify } from "ts-mockito";
import "isomorphic-fetch";

describe("PostStatus Integration Test", () => {
  const serverFacade = new ServerFacade();
  const mockPostStatusView = mock<PostStatusView>();
  const presenter = new PostStatusPresenter(instance(mockPostStatusView));

  const post = "Integration test status " + Date.now(); // Make post unique

  it("should correctly post a status and verify it in the user's story", async () => {
    // Login user
    const loginRequest = { alias: "@mario", password: "password" };
    const [loggedInUser, authToken] = await serverFacade.login(loginRequest);

    // Post status through presenter
    await presenter.submitPost(
      { preventDefault: () => {} } as React.MouseEvent,
      authToken,
      loggedInUser,
      post
    );

    // Verify success message was displayed
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
    ``;

    // Retrieve and verify status in user's story
    const [statuses] = await serverFacade.loadMoreStoryItems({
      userAlias: loggedInUser.alias,
      authToken: authToken.dto,
      pageSize: 10,
      lastItem: null,
    });

    // Verify the post appears in the story with correct details
    const postedStatus = statuses[0];
    expect(postedStatus.post).toEqual(post);
    expect(postedStatus.user.alias).toEqual(loggedInUser.alias);
    expect(postedStatus.user.firstName).toEqual(loggedInUser.firstName);
    expect(postedStatus.user.lastName).toEqual(loggedInUser.lastName);
    expect(postedStatus.timestamp).toBeDefined();
  });
});
