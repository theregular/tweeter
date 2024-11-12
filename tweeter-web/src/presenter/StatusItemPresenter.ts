import { AuthToken, Status } from "tweeter-shared";
import { View } from "./Presenter";
import {
  PAGE_SIZE,
  PagedItemPresenter,
  PagedItemView,
} from "./PagedItemPresenter";
import { StatusService } from "../model/service/StatusService";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  StatusService
> {
  public constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected createService(): StatusService {
    return new StatusService();
  }
}
