import { GetUserRequest, GetUserResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: GetUserRequest
): Promise<GetUserResponse> => {
  const service = new UserService();

  try {
    const foundUser = await service.getUser(request.authToken, request.alias);

    return {
      success: true,
      message: null,
      user: foundUser,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      user: null,
    };
  }
};
