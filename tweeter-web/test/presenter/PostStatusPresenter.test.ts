import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "ts-mockito";
import { StatusService } from "../../src/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/presenter/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;
  const authToken = new AuthToken("abc123", Date.now());
  const user = new User("Test", "Testerson", "tester", "test.jpg");
  const mouseEvent = { preventDefault: () => {} };
  const post = "Testing... :)";
  const status = new Status(post, user, Date.now());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockPostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(
      mockStatusServiceInstance
    );
  });

  it("tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(
      mouseEvent as React.MouseEvent,
      authToken,
      user,
      post
    );
    // let [capturedInfoMessage] = capture(
    //   mockPostStatusView.displayInfoMessage
    // ).last();

    // console.log(capturedInfoMessage);

    // let [capturedErrorMessage] = capture(
    //   mockPostStatusView.displayErrorMessage
    // ).last();

    // console.log(capturedErrorMessage);

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(
      mouseEvent as React.MouseEvent,
      authToken,
      user,
      post
    );
    // let [capturedErrorMessage] = capture(
    //   mockPostStatusView.displayErrorMessage
    // ).last();

    //     console.log(capturedErrorMessage);

    verify(mockStatusService.postStatus(authToken, anything())).once();
    let [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();
    // console.log(capturedAuthToken, capturedStatus);

    expect(capturedStatus.post).toEqual(post);
    expect(capturedAuthToken).toEqual(authToken);
  });
  it("tells view to clear info message, clear post, and display status posted message if successful", async () => {
    await postStatusPresenter.submitPost(
      mouseEvent as React.MouseEvent,
      authToken,
      user,
      post
    );
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();
  });

  it("tells view to display error message, clears last info message, and does not clear the post or display status message if unsuccessful", async () => {
    const error = new Error("An error occurred when posting");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);
    await postStatusPresenter.submitPost(
      mouseEvent as React.MouseEvent,
      authToken,
      user,
      post
    );

    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(
      mockPostStatusView.displayErrorMessage(
        `Failed to post the status because of exception: ${error.message}`
      )
    ).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});
