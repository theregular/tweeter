import { PagedItemRequest } from "tweeter-shared/src/model/net/request/PagedItemRequest";
import { StatusDto } from "tweeter-shared";
import { PagedItemResponse } from "tweeter-shared/src/model/net/response/PagedItemResponse";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PagedItemRequest<StatusDto>
): Promise<PagedItemResponse<StatusDto>> => {
  const statusService = new StatusService();
  const [items, hasMore] = await statusService.loadMoreFeedItems(
    request.authToken,
    request.userAlias,
    request.pageSize,
    request.lastItem
  );
  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
