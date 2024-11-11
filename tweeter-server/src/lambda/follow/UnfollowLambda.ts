import { FollowRequest, FollowResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: FollowRequest
): Promise<FollowResponse> => {
  const service = new UserService();
  const { token, user } = request;
  const [followerCount, followeeCount] = await service.unfollow(token, user);
  return {
    success: true,
    message: null,
    followerCount,
    followeeCount,
  };
};
