"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getRoleBadgeColor, capitalizeRole } from "@/utils/memberUtils";
import BlurIn from "../ui/blur-in";
import { FadeUp, StaggerReveal } from "../ui/fade-up";

interface MemberHeaderProps {
  name: string;
  role: string;
  delegateStatus?: string;
  avatarUrl?: string;
}

export function MemberHeader({
  name,
  role,
  delegateStatus,
  avatarUrl,
}: MemberHeaderProps) {
  const isDefaultAvatar = avatarUrl?.includes("missing_avatar_thumb");
  const imageSrc = isDefaultAvatar ? "/user.png" : avatarUrl;

  const formatName = (fullName: string) => {
    const match = fullName.match(/^(.*?)\s*(\(.*?\))(.*)$/);
    if (!match) return fullName;

    return (
      <>
        <span className="block md:inline">{match[1].trim()}</span>
        <span className="block md:inline md:ml-2">{match[2]}</span>
        {match[3] && (
          <span className="block md:inline md:ml-1">{match[3]}</span>
        )}
      </>
    );
  };

  return (
    <StaggerReveal className="flex flex-col items-center">
      <div className="text-center space-y-0 md:space-y-1">
        <BlurIn
          word={formatName(name)}
          className="text-2xl text-center font-bold tracking-tighter md:text-4xl"
        />
        <FadeUp className="space-x-2">
          <Badge
            className={`${getRoleBadgeColor(role)} rounded-lg bg-secondary border border-border hover:bg-accent transition-colors duration-200`}
            variant="outline"
          >
            <span>Cubing Kerala {capitalizeRole(role)}</span>
          </Badge>
          {delegateStatus && (
            <Badge
              className="text-yellow-500 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors duration-200"
              variant="outline"
            >
              WCA {capitalizeRole(delegateStatus)}
            </Badge>
          )}
        </FadeUp>
      </div>
      <FadeUp className="w-full max-w-[200px] h-[200px] my-4">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="w-full h-full rounded-md cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`View ${name}'s profile picture`}
            >
              <Avatar className="w-full h-full rounded-md">
                <AvatarImage
                  className="object-cover"
                  src={imageSrc}
                  alt="Profile Picture"
                />
                <AvatarFallback className="rounded-md bg-card text-foreground">
                  {name}
                </AvatarFallback>
              </Avatar>
            </button>
          </DialogTrigger>
          <DialogContent showClose={false} className="max-w-sm sm:max-w-md gap-0 p-2 sm:p-3">
            <DialogTitle className="sr-only">
              {name} — Profile Picture
            </DialogTitle>
            <div className="flex w-full items-center justify-center max-h-[70vh]">
              <Avatar className="w-full h-auto min-h-[200px] max-h-[70vh] rounded-md">
                <AvatarImage
                  className="object-contain"
                  src={imageSrc}
                  alt={`${name}'s profile picture`}
                />
                <AvatarFallback className="rounded-md bg-card text-foreground">
                  {name}
                </AvatarFallback>
              </Avatar>
            </div>
          </DialogContent>
        </Dialog>
      </FadeUp>
    </StaggerReveal>
  );
}
