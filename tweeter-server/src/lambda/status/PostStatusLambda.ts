import { PostStatusRequest } from "tweeter-shared/dist/model/net/request/PostStatusRequest";
import { TweeterResponse } from "tweeter-shared/dist/model/net/response/TweeterResponse";
import { StatusService } from "../../model/service/StatusService";

export const handler = async (
  request: PostStatusRequest
): Promise<TweeterResponse> => {
  const statusService = new StatusService();
  const { authToken, status } = request;

  try {
    await statusService.postStatus(authToken, status);
    return {
      success: true,
      message: null,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  }
};
