import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    try {
        const WCAIndianCompetitions = await axios.get("https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=IN&per_page=1000")
        const KeralaCompetitions = WCAIndianCompetitions.data.filter((competitions: any) => competitions.city.includes("Kerala"))
        const upComingCometitions = KeralaCompetitions.filter((competition: any) => new Date(competition.start_date) > new Date()).reverse()
        const pastCometitions = KeralaCompetitions.filter((competition: any) => new Date(competition.start_date ) <= new Date())
        return NextResponse.json({ upcomingCompetitions: upComingCometitions, pastCompetitions: pastCometitions })
    } catch (error) {
        return NextResponse.json("Error")
    }
}