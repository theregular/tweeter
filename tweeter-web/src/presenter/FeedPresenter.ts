import { Status } from "tweeter-shared";
import { PagedItemView } from "./PagedItemPresenter";
import { StatusItemPresenter } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
  public constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected get operation() {
    return this.service.loadMoreFeedItems;
  }
  protected getItemDescription(): string {
    return "load feed";
  }
}
