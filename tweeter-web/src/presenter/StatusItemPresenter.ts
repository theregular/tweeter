import { Status } from "tweeter-shared";
import { PagedItemPresenter, PagedItemView } from "./PagedItemPresenter";
import { StatusService } from "../model/service/StatusService";

export abstract class StatusItemPresenter extends PagedItemPresenter<
  Status,
  PagedItemView<Status>,
  StatusService
> {
  public constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected createService(): StatusService {
    return new StatusService();
  }
}
