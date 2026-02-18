"use client";

import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";

const social_links = [
  {
    id: "whatsapp",
    name: "Whatsapp",
    icon: FaWhatsapp,
    url: "https://chat.whatsapp.com/BQmcKIG0eKjLlDQYsPLHdS",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    url: "https://www.instagram.com/cubingkerala",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: FaFacebook,
    url: "https://www.facebook.com/cubingkeralaofficial",
  },
];

export function CubingKeralaUnravel() {
  const handleSocialClick = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="relative flex h-full w-full flex-col text-foreground items-center justify-center overflow-hidden">
      <div className="container bg-neutral-500/[0.04] px-4 z-20 border border-border rounded-lg py-10 md:py-24">
        <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
          <div className="space-y-4">
            <div className="inline-block rounded-lg text-green-500 text-sm">
              About Cubing Kerala
            </div>
            <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-7xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              Unraveling the Cube, Connecting the Community
            </h2>
            <p className="mx-auto text-muted-foreground max-w-[700px] text-[15px] md:text-lg">
              Cubing Kerala is a vibrant community of Rubik&apos;s Cube
              enthusiasts, founded in 2017 with the goal of promoting the art of
              cubing in the state. Over the years, we have organized numerous
              competitions, workshops, and social events, fostering a strong
              network of cubers and encouraging the growth of the sport.
            </p>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="inline-block rounded-lg text-green-500 text-sm">
              Our Mission
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-[15px] md:text-lg">
              At Cubing Kerala, our mission is to cultivate a vibrant cubing
              community, promote the sport, and provide a platform for cubers to
              showcase their skills, connect with like- minded individuals, and
              inspire the next generation of cubing enthusiasts.
            </p>
            <div className="w-full flex flex-col gap-5">
              <div className="inline-block rounded-lg text-start text-green-500 text-sm mt-5">
                Join us on socials
              </div>
              <div className="flex gap-2 items-center flex-wrap w-full justify-start text-sm">
                {social_links.map((social) => {
                  const Icon = social.icon;
                  return (
                    <button
                      key={social.id}
                      onClick={() => handleSocialClick(social.url)}
                      className="inline-flex items-center gap-2 text-[15px] font-medium text-foreground/70 hover:text-foreground border border-border hover:bg-accent px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Icon />
                      <span className="hidden md:block">
                        {social.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
