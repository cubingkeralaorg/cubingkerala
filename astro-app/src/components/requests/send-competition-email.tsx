import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Competition } from "@/types/competition";
import { formatCompetitionDateRange } from "@/utils/date-utils";

interface SendCompetitionEmailProps {
  upcomingCompetitions: Competition[];
  recipientCount: number;
}

/**
 * Admin-only competition announcement email — picks an upcoming competition
 * (its real data fills the template), an optional short message, sends to
 * everyone with emailConsent via /api/admin-send-competition-email.
 */
export function SendCompetitionEmail({ upcomingCompetitions, recipientCount }: SendCompetitionEmailProps) {
  const [competitionId, setCompetitionId] = useState(upcomingCompetitions[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  if (upcomingCompetitions.length === 0) {
    return <p className="text-sm text-muted-foreground">No upcoming competitions to announce right now.</p>;
  }

  const handleSend = async () => {
    if (!competitionId) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/admin-send-competition-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitionId, message: message.trim() || undefined }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string; sent?: number };
      if (!res.ok) {
        toast.error(data.message ?? "Failed to send");
        return;
      }
      toast.success(data.message ?? "Sent");
      setMessage("");
    } catch {
      toast.error("Failed to send — please try again");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border p-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="competition-select" className="text-sm font-medium">
          Competition
        </label>
        <select
          id="competition-select"
          value={competitionId}
          onChange={(event) => setCompetitionId(event.target.value)}
          disabled={isSending}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {upcomingCompetitions.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.name} — {formatCompetitionDateRange(competition.start_date, competition.end_date)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="competition-message" className="text-sm font-medium">
          Message (optional)
        </label>
        <Textarea
          id="competition-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={isSending}
          placeholder="Anything you'd like to add above the competition details..."
          rows={3}
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" size="sm" disabled={isSending || !competitionId} onClick={handleSend}>
          {isSending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <Mail className="size-4" />
              Send to {recipientCount} member{recipientCount === 1 ? "" : "s"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
