import axios from "axios"
import UpPastCompetitions from "./up-past-competitions";
export const dynamic = 'force-dynamic'

export default async function CompetitionsComponent() {

  const response = await axios.get("https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=IN&per_page=1000")
  
  return (
    <div className="w-full bg-neutral-950 mx-auto py-6 md:py-8 px-4 md:px-5 text-stone-200">
      <UpPastCompetitions response={response.data} />
    </div>
  )
}