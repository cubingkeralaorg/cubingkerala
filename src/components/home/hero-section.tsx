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
    <div className="relative flex min-h-[90vh] w-full overflow-hidden text-stone-200">
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
            <p className="text-stone-400 pb-5 mx-auto text-[15px] md:text-lg text-start md:text-center md:pt-5">
              Join us for competitions and meetups that connect cubers of all
              skill levels. <br />{" "}
              <strong className="text-white">Cubing Kerala</strong> is here to
              help you learn and grow.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-5">
              <div
                onClick={() => handleRedirectToContactPage()}
                className="w-full md:w-1/3"
              >
                <ShinyButton className="w-full py-2 rounded bg-neutral-200 hover:bg-neutral-300 transition-all duration-200 ease-in-out">
                  <div className="flex items-center justify-center gap-1 py-[2px] text-black">
                    <span>Contact Us</span>
                    <IoIosArrowForward />
                  </div>
                </ShinyButton>
              </div>
              <RainbowButton
                className="w-full md:w-fit text-green-400 rounded hover:text-green-500 gap-1"
                onClick={handleRedirectToWhatsapp}
              >
                <span>Join our Whatsapp group</span>
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
