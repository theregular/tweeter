import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<
  PagedItemView<T>
> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private _service: U;

  public constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): U;

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }

  protected get service() {
    return this._service;
  }

  reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }
  async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      if (this.hasMoreItems) {
        let [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      }
    }, this.getItemDescription());
  }

  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string
  ): Promise<[T[], boolean]> {
    return await this.operation(authToken, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected abstract getItemDescription(): string;

  protected abstract get operation(): (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ) => Promise<[T[], boolean]>;
}
