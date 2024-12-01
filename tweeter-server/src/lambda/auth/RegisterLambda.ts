import { UserService } from "../../model/service/UserService";
import { RegisterRequest, RegisterResponse } from "tweeter-shared";

export const handler = async (
  request: RegisterRequest
): Promise<RegisterResponse> => {
  const service = new UserService();

  try {
    const [user, authToken] = await service.register(
      request.firstName,
      request.lastName,
      request.alias,
      request.password,
      request.userImageBytes,
      request.imageFileExtension
    );

    return {
      success: true,
      message: null,
      user,
      authToken,
    };
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
      user: null,
      authToken: null,
    };
  }
};
