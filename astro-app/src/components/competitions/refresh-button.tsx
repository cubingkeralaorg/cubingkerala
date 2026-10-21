import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Ported from the old Next.js app's RefreshButton — public, no admin check
// (get-competitions is a public GET endpoint). Simplified to a page reload
// on success rather than local re-render state, matching JoinButton/
// AddMemberForm's pattern elsewhere in astro-app.
export function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/get-competitions?refresh=true");
      const data = (await res.json().catch(() => ({}))) as { source?: string };
      if (data.source === "wca-api-sync") {
        toast.success("Competitions refreshed");
      } else {
        toast.info("Already up to date");
      }
      // Give the toast a moment to actually paint before the reload tears
      // the page down — a reload fired in the same tick never gets to show
      // it at all.
      setTimeout(() => window.location.reload(), 800);
    } catch {
      toast.error("Failed to refresh — please try again");
      setIsRefreshing(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
      {isRefreshing ? <Loader2 className="size-4 animate-spin" /> : "Refresh"}
    </Button>
  );
}
