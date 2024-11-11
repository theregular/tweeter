export interface PagedItemRequest<D> {
  readonly token: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: D | null;
}
