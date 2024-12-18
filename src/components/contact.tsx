"use client";

import BlurIn from "./ui/blur-in";
import { RainbowButton } from "./ui/rainbow-button";

const handleContactWhatsappRedirect = () => {
    window.open('http://wa.me/919633062991', '_blank');
}

export default function ContactComponent() {
    return (
        <div className="flex flex-col items-center w-full px-6 py-8 space-y-6">
            <div className="flex flex-col items-center justify-center w-full space-y-4 h-[60vh] px-6 py-8 border border-neutral-800 rounded-lg shadow-lg">
                <BlurIn
                    word="Contact Us"
                    className="text-4xl text-stone-200 font-bold tracking-tighter md:text-6xl"
                />
                <p className="text-neutral-400 text-center text-[15px] md:text-lg w-full">
                    We&apos;d love to hear from you! Send us a message, we&apos;ll respond as soon as possible.
                </p>
                <div className="mt-auto">
                    <RainbowButton onClick={() => handleContactWhatsappRedirect()} className="text-green-400 text-sm px-4">Send us a message on whatsapp</RainbowButton>
                </div>
            </div>
        </div>
    );
}
