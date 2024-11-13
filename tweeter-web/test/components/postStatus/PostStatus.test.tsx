import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { anything, instance, mock, verify, when } from "ts-mockito";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../../src/presenter/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";

library.add(fab);

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  const mockPostStatusPresenter = mock<PostStatusPresenter>();
  const mockPostStatusPresenterInstance = instance(mockPostStatusPresenter);
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    mockUserInstance = instance(mock<User>());
    mockAuthTokenInstance = instance(mock<AuthToken>());
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });
  it("post status and clear buttons are both disabled on initial render", () => {
    //when(mockPostStatusPresenter.isLoading).thenReturn(false);

    const { postButton, clearButton } = renderPostStatusAndGetElement();

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("both buttons are enabled when the text field has text", async () => {
    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElement();
    await user.type(textField, "test post");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });
  it("both buttons are disabled after text is cleared", async () => {
    //when(mockPostStatusPresenter.isLoading).thenReturn(false);

    const { postButton, clearButton, textField, user } =
      renderPostStatusAndGetElement();

    await user.type(textField, "test post");

    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);

    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("submitPost method is called on presenter with correct parameters when Post Status button pressed", async () => {
    //when(mockPostStatusPresenter.isLoading).thenReturn(false);

    const { postButton, textField, user } = renderPostStatusAndGetElement();

    const post = "Test!";

    await user.type(textField, post);

    await user.click(postButton);

    verify(
      mockPostStatusPresenter.submitPost(
        anything(),
        mockAuthTokenInstance,
        mockUserInstance,
        post
      )
    );
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>{!!presenter ? <PostStatus /> : <PostStatus />}</MemoryRouter>
  );
};

const renderPostStatusAndGetElement = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus();

  const postButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const textField = screen.getByLabelText("postText");

  return { postButton, clearButton, textField, user };
};
