import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/services/auth.api";

export function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      const theme = window.localStorage.getItem('theme');
      window.localStorage.clear();
      if (theme) {
        window.localStorage.setItem('theme', theme);
      }
      
      window.dispatchEvent(new Event("auth-change"));
      router.refresh();
      router.replace("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return { handleLogout };
}
