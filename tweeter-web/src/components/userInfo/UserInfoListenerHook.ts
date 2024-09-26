import useUserInfo from "./UserInfoHook";

interface UserInfoListener {}

const useUserInfoListener = (): UserInfoListener => {
  const {} = useUserInfo();

  return {};
};

export default useUserInfoListener;
