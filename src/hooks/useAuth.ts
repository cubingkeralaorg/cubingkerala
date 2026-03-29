import { useState, useEffect } from "react";
import { UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookieUtils";

export function useAuth() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const syncAuth = () => {
      const user = getUserInfoFromCookie();
      setUserInfo(user || null);
    };

    syncAuth();

    window.addEventListener("auth-change", syncAuth);
    return () => window.removeEventListener("auth-change", syncAuth);
  }, []);

  return { userInfo, isLoggedIn: !!userInfo };
}
