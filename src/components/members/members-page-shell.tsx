"use client";

import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookie-utils";
import { joinCubingKerala } from "@/services/member.api";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/shared/page-shell";

export function MembersPageShell({
  children,
}: {
  children: ReactNode;
}) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isJoinCkLoading, setIsJoinCkLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const userInfoFromCookie = getUserInfoFromCookie();
    if (userInfoFromCookie) {
      setUserInfo(userInfoFromCookie);
    }
  }, []);

  const handleJoinCK = async () => {
    if (!userInfo) {
      toast.error("Please login to join Cubing Kerala");
      return;
    }

    setIsJoinCkLoading(true);

    try {
      const data = await joinCubingKerala(userInfo);
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to join Cubing Kerala",
      );
    } finally {
      setIsJoinCkLoading(false);
    }
  };

  return (
    <PageShell
      title="Members"
      description="Find cubers by name or WCA ID, and see who competes from Kerala."
      actions={
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleJoinCK}
          disabled={isJoinCkLoading}
        >
          {isJoinCkLoading ? (
            <Loader className="animate-spin" />
          ) : (
            "Join Cubing Kerala"
          )}
        </Button>
      }
    >
      {children}
    </PageShell>
  );
}
