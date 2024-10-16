import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "./PagedItemPresenter";

export class FollowerPresenter extends UserItemPresenter {
  protected get operation() {
    return this.service.loadMoreFollowers;
  }
  protected getItemDescription(): string {
    return "load followers";
  }
}
