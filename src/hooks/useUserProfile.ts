import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface UserProfile {
  isMember: boolean;
  email: string | null;
  emailConsent: boolean;
}

export function useUserProfile(enabled: boolean = true) {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await axios.get("/api/user/profile");
      return response.data;
    },
    enabled,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (data: { email?: string; emailConsent?: boolean }) => {
      const response = await axios.patch("/api/user/profile", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
