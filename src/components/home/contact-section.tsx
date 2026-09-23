import { Button } from "@/components/ui/button";

export function ContactSection() {
  const url = process.env.NEXT_PUBLIC_WHATSAPP_CONTACT_URL;

  return (
    <div id="contact" className="flex max-w-md flex-col gap-2">
      <p className="text-sm font-medium text-zinc-800">Get in touch</p>
      <p className="text-zinc-700 md:text-lg">
        Organizing, volunteering, or just getting started? Message us about
        competitions, membership, or learning to cube.
      </p>
      {url ? (
        <Button
          variant="link"
          className="h-auto w-fit px-0 text-zinc-900 underline hover:text-zinc-700"
          asChild
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            Message us on WhatsApp
          </a>
        </Button>
      ) : (
        <Button variant="link" className="h-auto w-fit px-0" disabled>
          WhatsApp unavailable
        </Button>
      )}
    </div>
  );
}
