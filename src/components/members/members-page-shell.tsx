"use client";

import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookie-utils";
import { joinCubingKerala } from "@/services/member.api";
import { NAVBAR_CONTAINER_CLASS } from "@/components/layout/navbar/layout";
import { Button } from "@/components/ui/button";

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
    <div className={`ck-landing py-10 ${NAVBAR_CONTAINER_CLASS}`}>
      <div className="mb-6 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
            Members
          </h1>
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
        </div>
        <p className="w-full text-sm text-muted-foreground md:text-base lg:whitespace-nowrap">
          Find cubers by name or WCA ID, and see who competes from Kerala.
        </p>
      </div>
      {children}
    </div>
  );
}
