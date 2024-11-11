import { PostStatusRequest } from "tweeter-shared/dist/model/net/request/PostStatusRequest";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  await statusService.postStatus(request.token, request.status);
  return {
    success: true,
    message: null,
  };
};
