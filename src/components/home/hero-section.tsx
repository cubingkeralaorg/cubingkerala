"use client";

import { cn, isMobileDevice } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";

import { RainbowButton } from "../ui/rainbow-button";
import { FadeIn, FadeUp, StaggerReveal } from "../ui/fade-up";
import { IoIosArrowForward } from "react-icons/io";
import ShinyButton from "../ui/shiny-button";
import { GradientText } from "@/components/shared";
import { ComingSoonBadge } from "@/components/learn";

const CubingKeralaGetStarted = () => {
  const handleRedirectToContactPage = (): void => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRedirectToWhatsapp = (): void => {
    const url = "https://chat.whatsapp.com/BQmcKIG0eKjLlDQYsPLHdS";
    if (isMobileDevice()) {
      window.location.assign(url);
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="relative flex min-h-[90vh] w-full overflow-hidden text-foreground">
      <div className="container px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center my-auto">
        <div className="grid h-full gap-10 sm:px-10 md:gap-16 md:grid-cols-1 pt-10 md:pt-5">
          <StaggerReveal className="space-y-2 md:space-y-4 text-start md:text-center w-full md:w-[50vw] mb-20">
            <FadeUp className="my-5">
              <ComingSoonBadge />
            </FadeUp>

            <FadeUp className="w-full flex justify-start md:justify-center">
              <GradientText width={4} name="Cubing Kerala" />
            </FadeUp>

            <FadeUp
              as="h1"
              className="text-4xl text-start md:text-center font-bold tracking-tighter md:text-7xl"
            >
              Rubik&apos;s Cube Community in Kerala.
            </FadeUp>

            <FadeUp
              as="p"
              className="text-muted-foreground pb-5 mx-auto text-[15px] md:text-lg text-start md:text-center md:pt-5"
            >
              Join us for competitions and meetups that connect cubers of all
              skill levels. <br />{" "}
              <strong className="text-foreground font-bold">
                Cubing Kerala
              </strong>{" "}
              is here to help you learn and grow.
            </FadeUp>

            <FadeUp className="flex flex-col md:flex-row items-center justify-center gap-5">
              <ShinyButton
                onClick={() => handleRedirectToContactPage()}
                className="w-full md:w-fit md:min-w-[200px] h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Contact Us</span>
                  <IoIosArrowForward />
                </div>
              </ShinyButton>
              <RainbowButton
                className="w-full md:w-fit rounded-lg gap-2 text-green-600 dark:text-green-400"
                onClick={handleRedirectToWhatsapp}
              >
                Join our Whatsapp group
                <IoIosArrowForward />
              </RainbowButton>
            </FadeUp>
          </StaggerReveal>
        </div>
      </div>

      <FadeIn className="absolute inset-0 pointer-events-none" delay={0.2}>
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,rgba(255,255,255,0.2),transparent)]",
          )}
        />
      </FadeIn>
    </div>
  );
};

export default CubingKeralaGetStarted;
