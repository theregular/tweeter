import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import Login from "../../../../src/components/authentication/login/Login";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  LoginPresenter,
  LoginView,
} from "../../../../src/presenter/LoginPresenter";
import { instance, mock, verify, when } from "ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElements("/");
    expect(signInButton).toBeDisabled();
  });
  it("enables sign-in button if alias and password fields have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    expect(signInButton).toBeEnabled();
  });

  it("disables sign-in button if alias and password fields are cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements("/");
    await user.type(aliasField, "a");
    await user.type(passwordField, "b");

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();
    await user.type(aliasField, "wah");
    expect(signInButton).toBeEnabled();
    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });
  it("calls presenters login method called with correct parameters when the sign-in button is pressed.", async () => {
    const mockPresenter = mock<LoginPresenter<LoginView>>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://someurl.com";
    const alias = "Test";
    const password = "password";

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElements(originalUrl, mockPresenterInstance);
    await user.type(aliasField, alias);
    await user.type(passwordField, password);

    await user.click(signInButton);

    verify(mockPresenter.doLogin(alias, password, originalUrl, false));
  });
});

const renderLogin = (
  originalUrl: string,
  presenter?: LoginPresenter<LoginView>
) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElements = (
  originalUrl: string,
  presenter?: LoginPresenter<LoginView>
) => {
  const user = userEvent.setup();
  renderLogin(originalUrl);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};
