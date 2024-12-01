import { LoginRequest, LoginResponse } from "tweeter-shared/src";
import { UserService } from "../../model/service/UserService";

export const handler = async (
  request: LoginRequest
): Promise<LoginResponse> => {
  const service = new UserService();

  try {
    const [user, token] = await service.login(request.alias, request.password);
    return {
      success: true,
      message: null,
      user,
      token,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      user: null,
      token: null,
    };
  }
};
