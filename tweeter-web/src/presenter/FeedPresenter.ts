import { StatusItemPresenter } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  protected get operation() {
    return this.service.loadMoreFeedItems;
  }
  protected getItemDescription(): string {
    return "load feed";
  }
}
