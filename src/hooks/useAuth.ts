import { useState, useEffect } from "react";
import { UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookieUtils";

export function useAuth() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const user = getUserInfoFromCookie();
    if (user) {
      setUserInfo(user);
    }
  }, []);

  return { userInfo, isLoggedIn: !!userInfo };
}
