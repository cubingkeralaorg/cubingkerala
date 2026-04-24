'use client'

import React from 'react'
import Link from 'next/link'
import { FaGithub } from "react-icons/fa";
import { LOGO_DARK, LOGO_LIGHT } from "@/config/navigation.config";
import Image from "next/image";
import { ThemeSwitcher } from "./navbar/themeSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/useLogout";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";


const handleLinkRedirect = () => {
    window.open("https://allenjohn.me", "_blank")
}


const handleGithubRedirect = () => {
    window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank")
}

const QUICK_LINKS = [
    { href: "/competitions", label: "Competitions" },
    { href: "/rankings", label: "Rankings" },
    { href: "/members", label: "Members" },
    { href: "/learn", label: "Learn" },
] as const

interface CubingKeralaFooterProps {
    compact?: boolean
}

const CubingKeralaFooter = ({ compact = false }: CubingKeralaFooterProps) => {
    const { isLoggedIn } = useAuth();
    const { profile, updateProfile, isUpdating } = useUserProfile(isLoggedIn);
    const { handleLogout } = useLogout();
    
    const handleUnsubscribe = async () => {
        try {
            await updateProfile({ emailConsent: false });
            toast.success("You have been unsubscribed from emails.");
        } catch (error) {
            toast.error("Failed to unsubscribe. Please try again.");
        }
    };
    
    if (compact) {
        return (
            <footer className="border-t border-border/70 bg-transparent py-4 text-muted-foreground w-full">
                <div className="flex flex-col items-start justify-start gap-1 text-left">
                    <p className="text-xs">&copy; 2026 Cubing Kerala. All rights reserved.</p>
                    <p className="text-xs text-muted-foreground/80">
                        Designed & Developed with ❤️ by <span onClick={handleLinkRedirect} className="cursor-pointer hover:text-foreground transition-colors font-medium">Allen John</span>
                    </p>
                </div>
            </footer>
        )
    }

    return (
        <footer className="mt-auto bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 border-t border-border py-10 md:py-12">
                    <div className="max-w-md">
                        <Link href="/" className="inline-flex items-center" aria-label="Cubing Kerala home">
                            <Image
                                src={LOGO_LIGHT}
                                alt="Cubing Kerala Logo"
                                width={42}
                                height={42}
                                className="w-[42px] h-auto block dark:hidden"
                            />
                            <Image
                                src={LOGO_DARK}
                                alt="Cubing Kerala Logo"
                                width={42}
                                height={42}
                                className="w-[42px] h-auto hidden dark:block"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                            Building Kerala&apos;s speedcubing community with competitions, rankings, resources, and support for every cuber.
                        </p>
                    </div>

                    <div className="md:ml-auto md:text-right md:pt-2">
                        <ul className="list-none flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-x-5 md:gap-y-2 md:justify-end">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {isLoggedIn && profile?.emailConsent && (
                                <li>
                                    <button
                                        onClick={handleUnsubscribe}
                                        disabled={isUpdating}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                                    >
                                        {isUpdating ? "Unsubscribing..." : "Unsubscribe from Emails"}
                                    </button>
                                </li>
                            )}
                            <li>
                                {isLoggedIn ? (
                                    <button
                                        onClick={handleLogout}
                                        className="text-sm text-red-500 hover:text-red-500/70 transition-colors whitespace-nowrap"
                                    >
                                        Logout
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="text-sm text-green-500 hover:text-green-500/70 transition-colors whitespace-nowrap"
                                    >
                                        Login
                                    </Link>
                                )}
                            </li>
                        </ul>
                        <div className="mt-4 flex items-center gap-3 md:justify-end">
                            <button
                                onClick={handleGithubRedirect}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/50 hover:text-foreground transition-all"
                                aria-label="Open GitHub"
                            >
                                <FaGithub size={16} />
                            </button>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-t border-border/70 py-8 md:py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.</p>
                    <p className="text-xs text-muted-foreground/80">
                        Designed & Developed with ❤️ by <span onClick={() => handleLinkRedirect()} className="cursor-pointer hover:text-foreground transition-colors font-medium">Allen John</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default CubingKeralaFooter