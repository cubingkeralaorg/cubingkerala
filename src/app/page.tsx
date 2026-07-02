import Link from "next/link";
import { AnimatedContactLink } from "@/components/contact";
import {
  HeroSection,
  CalendarSection,
  LegendsSection,
  UnravelSection,
} from "@/components/home";
import { HomePageSections } from "@/components/home/home-page-sections";
import { WhatsAppContactButton } from "@/components/home/whatsapp-contact-button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1 relative">
        <section className="w-full">
          <HeroSection />
        </section>

        <HomePageSections>
          <section className="px-4 sm:px-6 lg:px-8">
            <CalendarSection />
          </section>
          <section className="px-4 sm:px-6 lg:px-8">
            <LegendsSection />
          </section>
          <section className="px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto bg-neutral-500/[0.04] px-4 md:px-8 border border-border rounded-lg py-10 md:py-24">
              <div className="space-y-4 sm:px-10 text-start lg:text-center flex flex-col items-start lg:items-center">
                <div className="inline-block rounded-lg text-sm text-green-500">
                  Community Directory
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                  Meet Kerala Members
                </h2>
                <p className="max-w-[900px] text-muted-foreground text-[15px] md:text-lg lg:whitespace-nowrap">
                  Discover Kerala cubers, track progress, and stay connected with
                  the community.
                </p>
                <Link href="/members" className="w-fit">
                  <AnimatedContactLink userInfo={null} text="Members" />
                </Link>
              </div>
            </div>
          </section>
          <section className="px-4 sm:px-6 lg:px-8">
            <UnravelSection />
          </section>
          <section id="contact" className="px-4 sm:px-6 lg:px-8 pb-8 md:pb-10">
            <div className="container mx-auto bg-neutral-500/[0.04] px-4 md:px-8 border border-border rounded-lg py-10 md:py-16">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-12 sm:px-10">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-500">
                    Get in Touch
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Have a question?
                  </h2>
                  <p className="text-muted-foreground text-[15px] md:text-base leading-relaxed max-w-md">
                    We&apos;d love to hear from you. Send us a message and
                    we&apos;ll get back to you as soon as possible.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <WhatsAppContactButton />
                </div>
              </div>
            </div>
          </section>
        </HomePageSections>
      </main>
    </div>
  );
}
