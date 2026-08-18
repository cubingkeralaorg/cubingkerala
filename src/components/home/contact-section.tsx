import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ContactSection() {
  const url = process.env.NEXT_PUBLIC_WHATSAPP_CONTACT_URL;

  return (
    <Card id="contact" className="w-full max-w-sm shadow-none">
      <CardHeader className="flex flex-col items-start gap-2 space-y-0 p-5">
        <CardTitle>Get in touch</CardTitle>
        <CardDescription>
          Organizing, volunteering, or just getting started? Message us about
          competitions, membership, or learning to cube.
        </CardDescription>
        {url ? (
          <Button variant="link" className="h-auto w-fit px-0" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>
          </Button>
        ) : (
          <Button variant="link" className="h-auto w-fit px-0" disabled>
            WhatsApp unavailable
          </Button>
        )}
      </CardHeader>
    </Card>
  );
}
