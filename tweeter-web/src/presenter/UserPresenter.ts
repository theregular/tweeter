import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface UserView extends View {
  updateUserInfo: (
    currentUser: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
  navigate: (path: string) => void;
}

export abstract class UserPresenter<V extends UserView> extends Presenter<V> {
  protected service: UserService;

  public constructor(view: V) {
    super(view);
    this.service = new UserService();
  }

  async doAuthentication(
    alias: string,
    password: string,
    originalUrl: string | undefined,
    rememberMe: boolean
  ) {
    this.doFailureReportingOperation(async () => {
      this.isLoading = true;

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, this.getItemDescription());
  }

  protected abstract getItemDescription(): string;
}
