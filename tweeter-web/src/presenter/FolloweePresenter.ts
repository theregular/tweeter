import { UserItemPresenter } from "./UserItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected get operation() {
    return this.service.loadMoreFollowees;
  }
  protected getItemDescription(): string {
    return "load followees";
  }
}
