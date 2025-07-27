import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const res = await axios.get("https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=IN&per_page=1000");
    const keralaCompetitions = res.data.filter((competition: any) =>
      competition.city && competition.city.includes("Kerala")
    );

    const now = new Date();
    const upcomingCompetitions = keralaCompetitions
      .filter((competition: any) => new Date(competition.start_date) > now)
      .reverse();

    const pastCompetitions = keralaCompetitions
      .filter((competition: any) => new Date(competition.start_date) <= now);

    return NextResponse.json({ upcomingCompetitions, pastCompetitions });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch competitions" }, { status: 500 });
  }
}
