"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getRoleBadgeColor, capitalizeRole } from "@/utils/memberUtils";
import BlurIn from "../ui/blur-in";

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

  return (
    <>
      <div className="text-center space-y-0 md:space-y-1">
        <BlurIn
          word={name}
          className="text-2xl text-center font-bold tracking-tighter md:text-4xl"
        />
        <div className="space-x-2">
          <Badge
            className={`${getRoleBadgeColor(role)} rounded bg-neutral-900 hover:bg-neutral-900 border-none`}
            variant="secondary"
          >
            <span>Cubing Kerala {capitalizeRole(role)}</span>
          </Badge>
          {delegateStatus && (
            <Badge className="text-yellow-300 rounded bg-neutral-900 hover:bg-neutral-900 border-none">
              WCA {capitalizeRole(delegateStatus)}
            </Badge>
          )}
        </div>
      </div>
      <div className="w-full max-w-[200px] h-[200px] my-4">
        <Avatar className="w-full h-full rounded-md">
          <AvatarImage
            className="object-cover"
            src={isDefaultAvatar ? "/user.png" : avatarUrl}
            alt="Profile Picture"
          />
          <AvatarFallback className="rounded-md bg-neutral-900 text-stone-200">
            {name}
          </AvatarFallback>
        </Avatar>
      </div>
    </>
  );
}
