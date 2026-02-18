"use client";

import Link from "next/link";

interface MemberStatsProps {
  country: string;
  wcaid: string;
  competitionCount: number;
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
}

export function MemberStats({
  country,
  wcaid,
  competitionCount,
  medals,
}: MemberStatsProps) {
  return (
    <div className="flex flex-wrap gap-4 md:gap-8 items-center w-full max-w-fit py-2 px-4 text-foreground justify-center my-4">
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-medium">COUNTRY</p>
        <p className="text-sm font-semibold">{country.toUpperCase()}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-medium">WCA ID</p>
        <Link
          className="hover:text-blue-500"
          href={`https://www.worldcubeassociation.org/persons/${wcaid}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="text-sm font-semibold">{wcaid}</p>
        </Link>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-medium">COMPETITIONS</p>
        <p className="text-sm font-semibold">{competitionCount}</p>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-medium">MEDALS</p>
        <div className="flex justify-center items-center space-x-2">
          <p className="text-sm text-yellow-500 font-semibold">{medals.gold}</p>
          <p className="text-sm text-muted-foreground font-semibold">{medals.silver}</p>
          <p className="text-sm text-yellow-800 font-semibold">{medals.bronze}</p>
        </div>
      </div>
    </div>
  );
}
