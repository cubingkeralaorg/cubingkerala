import { UserInfo } from "@/types/api";

export const joinCubingKerala = async (userInfo: UserInfo) => {
  const response = await fetch("/api/join-cubingkerala", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to join Cubing Kerala");
  }

  return response.json();
};
