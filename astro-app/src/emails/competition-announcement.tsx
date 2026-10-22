import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { formatCompetitionDateRange } from "@/utils/date-utils";
import { getEventName } from "@/utils/event-names";

// Email clients render in light mode essentially universally (no toggle,
// and dark-mode media query support is too inconsistent to rely on for a
// one-off announcement), and don't support CSS custom properties — so this
// hardcodes hex equivalents of the site's actual light-mode theme tokens
// (src/styles/global.css) rather than introducing a second color system.
const COLORS = {
  primary: "#257E58",
  highlight: "#F5F4F5",
  foreground: "#221E1C",
  mutedForeground: "#7A736C",
  border: "#E4E2DD",
};

const SITE_ORIGIN = "https://cubingkerala.com";
// Rasterized ahead of time from the site's own assets (sharp) — inline
// SVG / icon fonts (both the logo and @cubing/icons, which the live site
// uses for event icons) aren't reliably supported across email clients,
// so both become plain <img> PNGs here instead.
const LOGO_URL = `${SITE_ORIGIN}/cubingkerala_logo_email.png`;
const eventIconUrl = (eventId: string) => `${SITE_ORIGIN}/event-icons/${eventId}.png`;

interface CompetitionAnnouncementProps {
  recipientName: string;
  competitionName: string;
  competitionId: string;
  startDate: string;
  endDate: string;
  city: string;
  venue: string;
  eventIds: string[];
  message?: string;
  unsubscribeUrl: string;
}

export function CompetitionAnnouncement({
  recipientName,
  competitionName,
  competitionId,
  startDate,
  endDate,
  city,
  venue,
  eventIds,
  message,
  unsubscribeUrl,
}: CompetitionAnnouncementProps) {
  const dateRange = formatCompetitionDateRange(startDate, endDate);
  const registerUrl = `https://www.worldcubeassociation.org/competitions/${competitionId}/register`;

  return (
    <Html>
      <Head />
      <Preview>{`${competitionName} — ${dateRange} in ${city}`}</Preview>
      <Tailwind>
        <Body style={{ backgroundColor: "#FFFFFF", fontFamily: "Helvetica, Arial, sans-serif", margin: 0 }}>
          <Container style={{ margin: "0 auto", maxWidth: "480px", padding: "40px 20px" }}>
            <Section>
              <Img src={LOGO_URL} width="36" height="36" alt="Cubing Kerala" />
            </Section>

            <Heading
              style={{
                color: COLORS.foreground,
                fontSize: "28px",
                fontWeight: 700,
                lineHeight: "1.3",
                margin: "28px 0 12px",
              }}
            >
              {competitionName}
            </Heading>

            <Text style={{ color: COLORS.foreground, fontSize: "16px", lineHeight: "1.6", margin: "0 0 8px" }}>
              Hi {recipientName},
            </Text>
            <Text style={{ color: COLORS.foreground, fontSize: "16px", lineHeight: "1.6", margin: "0 0 8px" }}>
              {message || `Here's what's coming up in Kerala's cubing scene.`}
            </Text>

            <Section
              style={{ backgroundColor: COLORS.highlight, borderRadius: "8px", margin: "24px 0", padding: "24px 20px" }}
            >
              <Text style={{ color: COLORS.foreground, fontSize: "15px", margin: "0 0 4px" }}>
                <strong>{dateRange}</strong>
              </Text>
              <Text style={{ color: COLORS.mutedForeground, fontSize: "14px", margin: "0 0 16px" }}>
                {venue}, {city}
              </Text>
              <Row>
                {eventIds.map((eventId) => (
                  <Column key={eventId} style={{ paddingRight: "10px", width: "1%" }}>
                    <Img src={eventIconUrl(eventId)} width="22" height="22" alt={getEventName(eventId)} />
                  </Column>
                ))}
              </Row>
            </Section>

            <Section style={{ margin: "0 0 32px" }}>
              <Button
                href={registerUrl}
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "12px 28px",
                  textDecoration: "none",
                }}
              >
                Register
              </Button>
            </Section>

            <Text style={{ color: COLORS.mutedForeground, fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px" }}>
              See you there!
              <br />— Cubing Kerala
            </Text>

            <Hr style={{ borderColor: COLORS.border, margin: "0 0 20px" }} />

            <Text style={{ color: COLORS.mutedForeground, fontSize: "12px", lineHeight: "1.6", margin: 0 }}>
              You're getting this because you opted in to competition updates from Cubing Kerala.{" "}
              <Link href={unsubscribeUrl} style={{ color: COLORS.mutedForeground, textDecoration: "underline" }}>
                Unsubscribe
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default CompetitionAnnouncement;
