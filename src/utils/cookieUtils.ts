import { parse } from "cookie";
import { UserInfo } from "@/types/api";

export const getUserInfoFromCookie = (): UserInfo | null => {
  const cookies = parse(document.cookie);
  const userInfoFromCookie = cookies.userInfo;

  if (userInfoFromCookie) {
    try {
      return JSON.parse(userInfoFromCookie);
    } catch (error) {
      console.error("Error parsing user info from cookie:", error);
      return null;
    }
  }

  return null;
};
