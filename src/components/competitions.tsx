import axios from "axios"
import UpPastCompetitions from "./up-past-competitions";

export default async function CompetitionsComponent() {

  const response = await axios.get("https://raw.githubusercontent.com/robiningelbrecht/wca-rest-api/master/api/competitions/IN.json")

  return (
    <div className="w-full mx-auto py-6 md:py-8 px-4 md:px-5 bg-black text-stone-200">
      <h1 className="text-3xl font-bold mb-10 text-green-500">Competitions</h1>
      <UpPastCompetitions response={response.data} />
    </div>
  )
}