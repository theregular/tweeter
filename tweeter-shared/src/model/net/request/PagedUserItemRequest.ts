export interface PagedUserItemRequest<D> {
  readonly token: string;
  readonly userAlias: string;
  readonly pageSize: number;
  readonly lastItem: D | null;
}
