"use client";

import BlurIn from "../ui/blur-in";
import { RainbowButton } from "../ui/rainbow-button";

const handleContactWhatsappRedirect = () => {
    window.open('http://wa.me/919633062991', '_blank');
}

export default function ContactComponent() {
    return (
        <div className="container mx-auto flex flex-col items-center w-full h-[calc(100dvh-58px)] overflow-hidden p-4">
            <div className="flex flex-col bg-card items-center justify-center w-full flex-1 space-y-4 px-6 py-8 border border-border rounded-lg shadow-sm dark:shadow-lg">
                <BlurIn
                    word="Contact Us"
                    className="text-4xl text-foreground font-bold tracking-tighter md:text-6xl"
                />
                <p className="text-muted-foreground text-center text-[15px] md:text-lg max-w-xl">
                    We&apos;d love to hear from you! Send us a message, we&apos;ll respond as soon as possible.
                </p>
                <div className="mt-auto">
                    <RainbowButton onClick={() => handleContactWhatsappRedirect()} className="text-green-600 dark:text-green-400 text-sm px-4 font-semibold">Send us a message on whatsapp</RainbowButton>
                </div>
            </div>
        </div>
    );
}
