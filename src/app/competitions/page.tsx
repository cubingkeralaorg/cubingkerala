import CompetitionsComponent from '@/components/competitions'
import axios from 'axios';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Competitions | Cubing Kerala",
  description: "Upcoming and past competitions of Rubik's Cube community in Kerala",
};

const Competitions = async () => {

  const response = await axios.get('https://www.worldcubeassociation.org/api/v0/competitions?country_iso2=IN&per_page=1000')

  return (
    <>
      <CompetitionsComponent response={response.data} /> 
    </>
  )
}

export default Competitions