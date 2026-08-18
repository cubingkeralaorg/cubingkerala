'use client'

import React from 'react'
import Link from 'next/link'
import { FaGithub, FaWhatsapp, FaInstagram, FaFacebook } from "react-icons/fa";
import { SOCIAL_LINKS } from "@/components/home/constants";
import { ThemeSwitcher } from "./navbar/theme-switcher";
import { NavLinks } from "./navbar/nav-links";
import {
    NAVBAR_BRAND_GAP_CLASS,
    NAVBAR_CONTAINER_CLASS,
    NAVBAR_ICON_BUTTON_CLASS,
    NAVBAR_LINKS_GAP_CLASS,
    NAVBAR_LOGO_LINK_CLASS,
} from "./navbar/layout";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const handleGithubRedirect = () => {
    window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank")
}

const SOCIAL_ICONS = {
    whatsapp: FaWhatsapp,
    instagram: FaInstagram,
    facebook: FaFacebook,
} as const

function FooterMeta() {
    return (
        <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="block sm:inline">
                &copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.
            </span>
            <span aria-hidden="true" className="hidden px-1 text-border sm:inline">
                &middot;
            </span>
            <span className="mt-1 block sm:mt-0 sm:inline">
                Designed &amp; Developed with ❤️ by{" "}
                <a
                    href="https://allenjohn.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium transition-colors hover:text-foreground"
                >
                    Allen John
                </a>
            </span>
        </p>
    )
}

interface EmailPreferencesProps {
    profile: { email: string | null; emailConsent: boolean }
    isUpdating: boolean
    isEditingEmail: boolean
    newEmail: string
    setIsEditingEmail: (value: boolean) => void
    setNewEmail: (value: string) => void
    onToggleSubscription: (consent: boolean) => void
    onUpdateEmail: () => void
}

function EmailPreferences({
    profile,
    isUpdating,
    isEditingEmail,
    newEmail,
    setIsEditingEmail,
    setNewEmail,
    onToggleSubscription,
    onUpdateEmail,
}: EmailPreferencesProps) {
    const subscribeLabel = profile.emailConsent
        ? "Unsubscribe from Emails"
        : "Subscribe to Emails"

    return (
        <div className="flex flex-col items-start gap-2 lg:items-end">
            <div className="flex flex-wrap items-center gap-1">
                <button
                    type="button"
                    onClick={() => onToggleSubscription(!profile.emailConsent)}
                    disabled={isUpdating}
                    className="inline-flex h-8 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                >
                    {isUpdating ? "Updating..." : subscribeLabel}
                </button>

                {!isEditingEmail && (
                    <button
                        type="button"
                        onClick={() => {
                            setIsEditingEmail(true)
                            setNewEmail(profile.email || "")
                        }}
                        disabled={isUpdating}
                        className="inline-flex h-8 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    >
                        Update Email Address
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                {isEditingEmail && (
                    <motion.div
                        key="edit-form"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:justify-end"
                    >
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="New email address"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring sm:min-w-[220px]"
                        />
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={onUpdateEmail}
                                disabled={isUpdating}
                                className="inline-flex h-8 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditingEmail(false)}
                                disabled={isUpdating}
                                className="inline-flex h-8 items-center rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function FooterActions() {
    return (
        <div className={cn("flex items-center", NAVBAR_LINKS_GAP_CLASS)}>
            {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICONS[social.id];
                return (
                    <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={NAVBAR_ICON_BUTTON_CLASS}
                        aria-label={social.name}
                    >
                        <Icon className="size-4" />
                    </a>
                );
            })}
            <button
                type="button"
                onClick={handleGithubRedirect}
                className={NAVBAR_ICON_BUTTON_CLASS}
                aria-label="Open GitHub"
            >
                <FaGithub className="size-4" />
            </button>
            <ThemeSwitcher />
        </div>
    )
}

const CubingKeralaFooter = ({ isAdmin = false }: { isAdmin?: boolean }) => {
    const { isLoggedIn } = useAuth();
    const { profile, updateProfile, isUpdating } = useUserProfile(isLoggedIn);
    const [isEditingEmail, setIsEditingEmail] = React.useState(false);
    const [newEmail, setNewEmail] = React.useState("");

    const handleToggleSubscription = async (newConsent: boolean) => {
        try {
            await updateProfile({ emailConsent: newConsent });
            toast.success(newConsent ? "You have been subscribed to emails." : "You have been unsubscribed from emails.");
        } catch {
            toast.error("Failed to update preferences. Please try again.");
        }
    };

    const handleUpdateEmail = async () => {
        if (!newEmail || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(newEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }
        try {
            await updateProfile({ email: newEmail });
            toast.success("Email updated successfully.");
            setIsEditingEmail(false);
        } catch {
            toast.error("Failed to update email. Please try again.");
        }
    };

    return (
        <footer className="ck-landing border-t border-border/60 bg-background">
            <div className={NAVBAR_CONTAINER_CLASS}>
                <div className="flex flex-col gap-6 py-8 lg:gap-5">
                    <div className="flex flex-col gap-5 lg:h-16 lg:flex-row lg:items-center lg:justify-between">
                        <div className={cn("flex flex-col lg:min-w-0 lg:flex-row lg:items-center", NAVBAR_BRAND_GAP_CLASS)}>
                            <Link href="/" className={NAVBAR_LOGO_LINK_CLASS}>
                                Cubing Kerala
                            </Link>
                            <nav
                                className={cn(
                                    "-ml-2.5 grid grid-cols-2 gap-x-2 gap-y-1 lg:ml-0 lg:flex lg:items-center",
                                    NAVBAR_LINKS_GAP_CLASS,
                                )}
                                aria-label="Footer"
                            >
                                <NavLinks isAdmin={isAdmin} />
                            </nav>
                        </div>

                        <FooterActions />
                    </div>

                    {isLoggedIn && profile?.email && (
                        <EmailPreferences
                            profile={profile}
                            isUpdating={isUpdating}
                            isEditingEmail={isEditingEmail}
                            newEmail={newEmail}
                            setIsEditingEmail={setIsEditingEmail}
                            setNewEmail={setNewEmail}
                            onToggleSubscription={handleToggleSubscription}
                            onUpdateEmail={handleUpdateEmail}
                        />
                    )}

                    <FooterMeta />
                </div>
            </div>
        </footer>
    )
}

export default CubingKeralaFooter
