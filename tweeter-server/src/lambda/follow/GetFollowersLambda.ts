import { PagedItemRequest } from "tweeter-shared/src/model/net/request/PagedItemRequest";
import { UserDto } from "tweeter-shared";
import { PagedItemResponse } from "tweeter-shared/src/model/net/response/PagedItemResponse";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (
  request: PagedItemRequest<UserDto>
): Promise<PagedItemResponse<UserDto>> => {
  const followService = new FollowService();
  const [items, hasMore] = await followService.loadMoreFollowers(
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
