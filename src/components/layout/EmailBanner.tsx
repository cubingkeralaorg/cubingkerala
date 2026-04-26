"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Mail, Bell } from "lucide-react";
import { toast } from "sonner";

export const EmailBanner = () => {
  const { isLoggedIn } = useAuth();
  const { profile, isLoading, updateProfile, isUpdating } = useUserProfile(isLoggedIn);
  const [emailInput, setEmailInput] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);

  // Conditions to hide banner
  if (!isLoggedIn || isLoading || isDismissed) return null;
  if (!profile?.isMember) return null;
  
  // If user has email and consent, don't show
  if (profile.email && profile.emailConsent) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailInput)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await updateProfile({ email: emailInput });
      toast.success("Email added successfully!");
    } catch (error) {
      toast.error("Failed to update email. Please try again.");
    }
  };

  const handleConsent = async (consent: boolean) => {
    try {
      await updateProfile({ emailConsent: consent });
      if (consent) {
        toast.success("You are now subscribed to updates!");
      } else {
        toast.info("You've opted out of updates.");
        setIsDismissed(true); // Hide banner if they explicitly opt out for now
      }
    } catch (error) {
      toast.error("Failed to update preferences. Please try again.");
    }
  };

  // State 1: Needs Email
  if (!profile.email) {
    return (
      <div className="w-full bg-background border-b border-border/40 py-3 px-4 z-50 relative">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-foreground/80">
            <span>Add your email to receive Kerala competition updates and important information.</span>
          </div>
          <form onSubmit={handleEmailSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              className="px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-foreground/50 w-full sm:w-64"
              required
            />
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-1.5 rounded-md bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {isUpdating ? "Saving..." : "Add Email"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // State 2: Needs Consent (Has email but no consent)
  if (profile.email && !profile.emailConsent) {
    return (
      <div className="w-full bg-background border-b border-border/40 py-3 px-4 z-50 relative">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-foreground/80">
            <Bell size={16} className="text-foreground" />
            <span>Can we send new competition alerts and important info to <strong>{profile.email}</strong>?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleConsent(true)}
              disabled={isUpdating}
              className="px-4 py-1.5 rounded-md bg-foreground text-background font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              Yes, keep me updated
            </button>
            <button
              onClick={() => handleConsent(false)}
              disabled={isUpdating}
              className="px-4 py-1.5 rounded-md bg-muted text-muted-foreground font-medium hover:bg-muted/80 transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              No thanks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
