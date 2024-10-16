import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  protected get operation() {
    return this.service.loadMoreStoryItems;
  }
  protected getItemDescription(): string {
    return "load story";
  }
}
