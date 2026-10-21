import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import type { UserProfile } from "@/types/member";

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

interface EmailControlProps {
  isLoggedIn: boolean;
  initialProfile: UserProfile | null;
}

/**
 * Replaces the old full-width EmailBanner — this sits inline next to the
 * footer's social icons instead of taking its own row, since the update
 * emails are explicitly optional ("just an option to get the latest
 * competition information"), not something worth interrupting the page
 * for. Shows "Add email" when none is set, the email itself once it is;
 * either way, clicking opens a modal to set/change the email, toggle
 * update consent, or remove it entirely. isLoggedIn/initialProfile are
 * still computed server-side in Layout.astro (passed through Footer) —
 * same SSR reasoning as before, just a different trigger UI.
 */
export function EmailControl({ isLoggedIn, initialProfile }: EmailControlProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isOpen, setIsOpen] = useState(false);
  const [emailInput, setEmailInput] = useState(initialProfile?.email ?? "");
  const [consent, setConsent] = useState(initialProfile?.emailConsent ?? false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isLoggedIn || !profile?.isMember) return null;

  const openModal = () => {
    setEmailInput(profile.email ?? "");
    setConsent(profile.emailConsent);
    setIsOpen(true);
  };

  const patchProfile = async (data: { email?: string | null; emailConsent?: boolean }) => {
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => ({}))) as {
      email?: string | null;
      emailConsent?: boolean;
      message?: string;
    };
    if (!res.ok) {
      toast.error(body.message ?? "Failed to update");
      return false;
    }
    setProfile((prev) =>
      prev ? { ...prev, email: body.email ?? null, emailConsent: body.emailConsent ?? false } : prev,
    );
    return true;
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(emailInput)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSaving(true);
    const ok = await patchProfile({ email: emailInput, emailConsent: consent });
    setIsSaving(false);
    if (ok) {
      toast.success("Preferences updated");
      setIsOpen(false);
    }
  };

  const handleRemove = async () => {
    setIsSaving(true);
    const ok = await patchProfile({ email: null, emailConsent: false });
    setIsSaving(false);
    if (ok) {
      toast.success("Email removed");
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        <Mail className="size-3.5 shrink-0" />
        {profile.email ? (
          <span className="whitespace-nowrap">{profile.email}</span>
        ) : (
          <span>Add email</span>
        )}
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogTitle>Competition email updates</DialogTitle>
          <DialogDescription className="mt-1">
            Optional — get notified about new Kerala competitions. Not mandatory.
          </DialogDescription>
          <form onSubmit={handleSave} className="mt-4 flex flex-col gap-4">
            <Input
              type="email"
              value={emailInput}
              onChange={(event) => setEmailInput(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="size-4 rounded border-input"
              />
              Send me competition updates
            </label>
            <div className="flex items-center justify-between gap-2">
              {profile.email ? (
                <Button type="button" variant="outline" size="sm" onClick={handleRemove} disabled={isSaving}>
                  Remove email
                </Button>
              ) : (
                <span />
              )}
              <div className="flex items-center gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" size="sm" disabled={isSaving}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
