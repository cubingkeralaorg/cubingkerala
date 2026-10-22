import { Resend } from "resend";
import { env } from "cloudflare:workers";
import { CompetitionAnnouncement } from "@/emails/competition-announcement";
import { getConsentedUsers } from "@/db/queries/users";
import { createUnsubscribeToken } from "./unsubscribe-token";
import type { Db } from "@/db/client";
import type { Competition } from "@/types/competition";
import type { CreateBatchOptions } from "resend";

const SITE_ORIGIN = "https://cubingkerala.com";
const FROM = "Cubing Kerala <info@cubingkerala.com>";
// Resend's batch endpoint accepts up to 100 messages per call.
const BATCH_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

/**
 * Sends a competition announcement to every consented member, one
 * individually-addressed email each (never multiple real recipients in one
 * `to` field — that would leak everyone's address to everyone else). Each
 * recipient gets their own HMAC-signed unsubscribe link, no login required.
 */
export async function sendCompetitionAnnouncement(
  db: Db,
  competition: Competition,
  message?: string,
): Promise<{ sent: number }> {
  const recipients = await getConsentedUsers(db);
  if (recipients.length === 0) return { sent: 0 };

  const resend = new Resend(env.RESEND_API_KEY);
  const subject = `${competition.name} — ${competition.city}`;

  const payload: CreateBatchOptions = await Promise.all(
    recipients.map(async (recipient) => {
      const token = await createUnsubscribeToken(recipient.wcaid, env.EMAIL_UNSUBSCRIBE_SECRET);
      const unsubscribeUrl = `${SITE_ORIGIN}/unsubscribe?wcaid=${encodeURIComponent(recipient.wcaid)}&token=${token}`;

      return {
        from: FROM,
        to: recipient.email,
        subject,
        // RFC 8058 one-click unsubscribe headers — a real deliverability
        // trust signal (Gmail/Yahoo surface this as a native "Unsubscribe"
        // link next to the sender), separate from and in addition to the
        // in-body link, which a header alone doesn't replace.
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        react: CompetitionAnnouncement({
          recipientName: recipient.name.split("(")[0].trim(),
          competitionName: competition.name,
          competitionId: competition.id,
          startDate: competition.start_date,
          endDate: competition.end_date,
          city: competition.city,
          venue: competition.venue,
          eventIds: competition.event_ids,
          message,
          unsubscribeUrl,
        }),
      };
    }),
  );

  for (const batch of chunk(payload, BATCH_SIZE)) {
    const { error } = await resend.batch.send(batch);
    if (error) throw new Error(`Resend batch send failed: ${error.message}`);
  }

  return { sent: payload.length };
}
