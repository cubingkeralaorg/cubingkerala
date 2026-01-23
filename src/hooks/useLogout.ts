import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/services/authApi";

export function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      setTimeout(() => {
        window.localStorage.clear();
        window.location.reload();
      }, 2000);
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return { handleLogout };
}
