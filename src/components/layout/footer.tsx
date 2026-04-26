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
import { motion, AnimatePresence } from "framer-motion";


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
    const [isEditingEmail, setIsEditingEmail] = React.useState(false);
    const [newEmail, setNewEmail] = React.useState("");
    
    const handleToggleSubscription = async (newConsent: boolean) => {
        try {
            await updateProfile({ emailConsent: newConsent });
            toast.success(newConsent ? "You have been subscribed to emails." : "You have been unsubscribed from emails.");
        } catch (error) {
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
        } catch (error) {
            toast.error("Failed to update email. Please try again.");
        }
    };
    
    if (compact) {
        return (
            <footer className="bg-transparent py-4 text-muted-foreground w-full">
                <div className="flex flex-col items-start justify-start gap-4 text-left">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleGithubRedirect}
                                className="text-foreground/50 hover:text-foreground p-2 rounded-lg transition-colors"
                                aria-label="GitHub repository"
                            >
                                <FaGithub size={20} />
                            </button>
                            <ThemeSwitcher />
                        </div>

                        {isLoggedIn && profile?.email && (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleToggleSubscription(!profile.emailConsent)}
                                    disabled={isUpdating}
                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                                >
                                    {isUpdating 
                                        ? "Updating..." 
                                        : profile.emailConsent 
                                            ? "Unsubscribe" 
                                            : "Subscribe"}
                                </button>
                                
                                {!isEditingEmail && (
                                    <button
                                        onClick={() => { setIsEditingEmail(true); setNewEmail(profile.email || ""); }}
                                        disabled={isUpdating}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                                    >
                                        Update Email
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {isLoggedIn && profile?.email && isEditingEmail && (
                        <div className="w-full pt-1 pb-2">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key="edit-form-compact"
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="flex flex-col gap-2 w-full"
                                >
                                    <input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="New email"
                                        className="px-3 py-2 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/50 w-full"
                                    />
                                    <div className="flex items-center gap-2 justify-end">
                                        <button
                                            onClick={handleUpdateEmail}
                                            disabled={isUpdating}
                                            className="text-sm bg-foreground text-background px-4 py-1.5 rounded hover:bg-foreground/90 transition-colors disabled:opacity-50 font-medium"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setIsEditingEmail(false)}
                                            disabled={isUpdating}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    )}
                    
                    <div className="border-t border-border/70 pt-8 flex flex-col items-start justify-start gap-2 w-full">
                        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.</p>
                        <p className="text-xs text-muted-foreground/80">
                            Designed & Developed with ❤️ by <span onClick={() => handleLinkRedirect()} className="cursor-pointer hover:text-foreground transition-colors font-medium">Allen John</span>
                        </p>
                    </div>
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
                        <div className="mt-4 flex flex-col items-start md:items-end gap-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleGithubRedirect}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/50 hover:text-foreground transition-all"
                                    aria-label="Open GitHub"
                                >
                                    <FaGithub size={16} />
                                </button>
                                <ThemeSwitcher />
                            </div>
                            {isLoggedIn && profile?.email && (
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                                    <button
                                        onClick={() => handleToggleSubscription(!profile.emailConsent)}
                                        disabled={isUpdating}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                                    >
                                        {isUpdating 
                                            ? "Updating..." 
                                            : profile.emailConsent 
                                                ? "Unsubscribe from Emails" 
                                                : "Subscribe to Emails"}
                                    </button>
                                    
                                    <AnimatePresence mode="wait">
                                        {isEditingEmail ? (
                                            <motion.div
                                                key="edit-form"
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center gap-2 mt-1 md:mt-0"
                                            >
                                                <input
                                                    type="email"
                                                    value={newEmail}
                                                    onChange={(e) => setNewEmail(e.target.value)}
                                                    placeholder="New email address"
                                                    className="px-2 py-1 text-sm rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-foreground/50 w-full sm:min-w-[220px]"
                                                />
                                                <button
                                                    onClick={handleUpdateEmail}
                                                    disabled={isUpdating}
                                                    className="text-sm bg-foreground text-background px-3 py-1 rounded hover:bg-foreground/90 transition-colors disabled:opacity-50 font-medium"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => setIsEditingEmail(false)}
                                                    disabled={isUpdating}
                                                    className="text-sm text-muted-foreground hover:text-foreground transition-colors px-1"
                                                >
                                                    Cancel
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.button
                                                key="update-btn"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ duration: 0.2 }}
                                                onClick={() => { setIsEditingEmail(true); setNewEmail(profile.email || ""); }}
                                                disabled={isUpdating}
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                                            >
                                                Update Email Address
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
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