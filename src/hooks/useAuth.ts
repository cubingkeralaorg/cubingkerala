import { useState, useEffect } from "react";
import { UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookie-utils";

export function useAuth() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const syncAuth = () => {
      const user = getUserInfoFromCookie();
      setUserInfo(user || null);
      setReady(true);
    };

    syncAuth();

    window.addEventListener("auth-change", syncAuth);
    return () => window.removeEventListener("auth-change", syncAuth);
  }, []);

  return { userInfo, isLoggedIn: !!userInfo, ready };
}
