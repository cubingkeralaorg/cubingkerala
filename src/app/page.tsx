"use client";

import { useOnScreen } from "@/utils/animation";
import { useEffect, useState } from "react";
import { parse } from "cookie";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AnimatedContactLink } from "@/components/contact";
import { HeroSection, CalendarSection, LegendsSection, UnravelSection } from "@/components/home";
import { UserInfo } from "@/types/api";
import { isMobileDevice } from "@/lib/utils";

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const router = useRouter();

  const [ref1, isVisible1] = useOnScreen({ threshold: 0.1 });
  const [hasAnimated1, setHasAnimated1] = useState(false);

  useEffect(() => {
    if (isVisible1 && !hasAnimated1) setHasAnimated1(true);
  }, [isVisible1, hasAnimated1]);

  useEffect(() => {
    scrollTo(0, 0);

    if (typeof window !== "undefined") {
      const cookies = parse(document.cookie);
      const userInfo = cookies.userInfo;

      if (userInfo) {
        try {
          setUserInfo(JSON.parse(userInfo));
        } catch (e) {
          console.error("Failed to parse userInfo cookie", e);
        }
      }
    }
  }, []);

  const handleWhatsAppContact = () => {
    const url = process.env.NEXT_PUBLIC_WHATSAPP_CONTACT_URL;
    if (!url) {
      console.warn("WhatsApp contact URL is not configured in environment variables.");
      return;
    }

    if (isMobileDevice()) {
      window.location.assign(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1 space-y-5 relative">
        <section ref={ref1} className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: hasAnimated1 ? 1 : 0,
              y: hasAnimated1 ? 0 : 20,
            }}
            transition={{ duration: 1 }}
          >
            <HeroSection />
          </motion.div>
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <CalendarSection />
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <LegendsSection />
        </section>
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto bg-neutral-500/[0.04] px-4 md:px-8 border border-border rounded-lg py-10 md:py-24">
            <div className="space-y-4 sm:px-10 text-start md:text-center flex flex-col items-start md:items-center">
              <div className="inline-block rounded-lg text-sm text-green-500">
                Community Directory
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-7xl">
                Meet Kerala Members
              </h2>
              <p className="max-w-[900px] text-muted-foreground text-[15px] md:text-lg lg:whitespace-nowrap">
                Discover Kerala cubers, track progress, and stay connected with the community.
              </p>
              <div onClick={() => router.push("/members")} className="w-fit">
                <AnimatedContactLink userInfo={null} text="Members" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8">
          <UnravelSection />
        </section>

        {/* Contact Section */}
        <section id="contact" className="px-4 sm:px-6 lg:px-8 pb-8 md:pb-10">
          <div className="container mx-auto bg-neutral-500/[0.04] px-4 md:px-8 border border-border rounded-lg py-10 md:py-16">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12 sm:px-10">
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-500">
                  Get in Touch
                </p>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Have a question?
                </h2>
                <p className="text-muted-foreground text-[15px] md:text-base leading-relaxed max-w-md">
                  We&apos;d love to hear from you. Send us a message and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={handleWhatsAppContact}
                  className="inline-flex items-center gap-2.5 h-11 px-6 rounded-lg bg-foreground text-background font-medium text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Message us on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

