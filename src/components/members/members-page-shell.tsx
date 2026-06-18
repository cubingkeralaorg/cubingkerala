"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import BlurIn from "../ui/blur-in";
import { Loader } from "lucide-react";
import { UserInfo } from "@/types/api";
import { getUserInfoFromCookie } from "@/utils/cookieUtils";
import { joinCubingKerala } from "@/services/member.api";
import { FadeUp, PageReveal } from "../ui/fade-up";

export function MembersPageShell({
  children,
}: {
  children: React.ReactNode;
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
    <div className="container mx-auto py-6 md:py-8 px-4 md:px-5 text-foreground flex flex-col">
      <PageReveal>
        <div className="flex justify-between items-center gap-6 mb-4">
          <BlurIn
            word="Members"
            className="text-4xl text-start font-bold tracking-tighter md:text-6xl"
          />
          <FadeUp className="w-2/3 md:w-1/4 flex justify-end items-center">
            <button
              onClick={handleJoinCK}
              disabled={isJoinCkLoading}
              className={`rounded-md w-[150px] md:w-[200px] px-3 py-1 md:px-5 md:py-2 bg-card border border-border hover:bg-accent hover:text-foreground transition-all duration-200 ease-in-out ${isJoinCkLoading ? "opacity-70 cursor-not-allowed delay-0" : ""}`}
            >
              {isJoinCkLoading ? (
                <div className="flex items-center justify-center py-[2px] md:py-[1px]">
                  <Loader className="animate-spin text-foreground" size={14} />
                </div>
              ) : (
                <span className="text-xs md:text-sm text-foreground font-semibold">
                  Join Cubing Kerala
                </span>
              )}
            </button>
          </FadeUp>
        </div>

        <div
          className="rounded-md border border-border"
          style={{ minHeight: "600px", overflow: "hidden" }}
        >
          {children}
        </div>
      </PageReveal>
    </div>
  );
}
