import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface LoginView extends View {
  navigate: NavigateFunction;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
}

export class LoginPresenter<V extends LoginView> extends Presenter<V> {
  private _service: UserService;

  public constructor(view: V) {
    super(view);
    this._service = new UserService();
  }
  async doLogin(
    alias: string,
    password: string,
    originalUrl: string | undefined,
    rememberMe: boolean
  ) {
    await this.doFailureReportingOperation(async () => {
      this.isLoading = true;

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user");
  }

  protected get service() {
    return this._service;
  }
}
