"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { capitalizeRole } from "@/utils/member-utils";

interface MemberHeaderProps {
  name: string;
  role: string;
  delegateStatus?: string;
  avatarUrl?: string;
  wcaid: string;
  country?: string;
  countryIso2?: string;
  competitionCount: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

const getFlagEmoji = (countryCode: string) => {
  if (!countryCode) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

function Stat({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground md:text-base">{children}</div>
    </div>
  );
}

export function MemberHeader({
  name,
  role,
  delegateStatus,
  avatarUrl,
  wcaid,
  country,
  countryIso2,
  competitionCount,
  medals,
}: MemberHeaderProps) {
  const isDefaultAvatar = avatarUrl?.includes("missing_avatar_thumb");
  const imageSrc = isDefaultAvatar ? "/user.png" : avatarUrl;
  const displayName = name.split("(")[0].trim();
  const localName = name.match(/\((.*?)\)/)?.[1];

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-10">
      <div className="flex min-w-0 items-start gap-4 md:gap-6">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="size-20 shrink-0 overflow-hidden rounded-md border border-border md:size-28 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={`View ${name}'s profile picture`}
            >
              <Avatar className="size-full rounded-none">
                <AvatarImage
                  className="object-cover"
                  src={imageSrc}
                  alt={`${name}'s profile picture`}
                />
                <AvatarFallback className="rounded-none bg-card text-sm text-foreground">
                  {displayName.slice(0, 1)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DialogTrigger>
          <DialogContent
            showClose={false}
            className="max-w-sm gap-0 p-2 sm:max-w-md sm:p-3"
          >
            <DialogTitle className="sr-only">
              {name} — Profile Picture
            </DialogTitle>
            <div className="flex max-h-[70vh] w-full items-center justify-center">
              <Avatar className="h-auto max-h-[70vh] min-h-[200px] w-full rounded-md">
                <AvatarImage
                  className="object-contain"
                  src={imageSrc}
                  alt={`${name}'s profile picture`}
                />
                <AvatarFallback className="rounded-md bg-card text-foreground">
                  {displayName}
                </AvatarFallback>
              </Avatar>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex min-w-0 flex-col gap-2 pt-0.5 md:pt-1">
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
            {displayName}
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Cubing Kerala {capitalizeRole(role)}
            {localName ? ` · ${localName}` : ""}
            {delegateStatus
              ? ` · WCA ${capitalizeRole(delegateStatus)}`
              : ""}
          </p>
          <Button variant="link" className="h-auto w-fit px-0" asChild>
            <Link
              href={`https://www.worldcubeassociation.org/persons/${wcaid}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {wcaid}
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-x-8 gap-y-4 md:justify-end">
        {(countryIso2 || country) && (
          <Stat label="Country">
            <span className="inline-flex items-center gap-2">
              {country}
              {countryIso2 ? <span>{getFlagEmoji(countryIso2)}</span> : null}
            </span>
          </Stat>
        )}
        <Stat label="Competitions">{competitionCount}</Stat>
        <Stat label="Medals">
          <span className="inline-flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-yellow-500" />
              {medals.gold}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate-400" />
              {medals.silver}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-yellow-800" />
              {medals.bronze}
            </span>
          </span>
        </Stat>
      </div>
    </div>
  );
}
