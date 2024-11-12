import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected loadMoreItemsServiceCall(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem
    );
  }

  protected getItemDescription(): string {
    return "load followers";
  }
}
