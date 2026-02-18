"use client";

import { cn } from "@/lib/utils";
import DotPattern from "@/components/magicui/dot-pattern";
import { useRouter } from "next/navigation";
import { RainbowButton } from "../ui/rainbow-button";
import BlurIn from "../ui/blur-in";
import { IoIosArrowForward } from "react-icons/io";
import ShinyButton from "../ui/shiny-button";
import { GradientText } from "@/components/shared";
import { ComingSoonBadge } from "@/components/learn";

const CubingKeralaGetStarted = () => {
  const router = useRouter();

  const handleRedirectToContactPage = (): void => {
    router.push("/contact");
  };

  const handleRedirectToWhatsapp = (): void => {
    window.open("https://chat.whatsapp.com/BQmcKIG0eKjLlDQYsPLHdS", "_blank");
  };

  return (
    <div className="relative flex min-h-[90vh] w-full overflow-hidden text-foreground">
      <div className="container px-6 flex flex-col justify-center items-center my-auto">
        <div className="grid h-full gap-10 sm:px-10 md:gap-16 md:grid-cols-1 pt-10 md:pt-5">
          <div className="space-y-2 md:space-y-4 text-start md:text-center w-full md:w-[50vw] mb-20">
            <div className="my-5">
              <ComingSoonBadge />
            </div>
            <div className="w-full flex justify-start md:justify-center">
              <GradientText width={4} name="Cubing Kerala" />
            </div>
            <BlurIn
              word="Rubik's Cube Community in Kerala."
              className="text-4xl text-start md:text-center font-bold tracking-tighter md:text-7xl"
            />
            <p className="text-muted-foreground pb-5 mx-auto text-[15px] md:text-lg text-start md:text-center md:pt-5">
              Join us for competitions and meetups that connect cubers of all
              skill levels. <br />{" "}
              <strong className="text-foreground font-bold">Cubing Kerala</strong> is here to
              help you learn and grow.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-5">
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
            </div>
          </div>
        </div>
      </div>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
        )}
      />
    </div>
  );
};

export default CubingKeralaGetStarted;
