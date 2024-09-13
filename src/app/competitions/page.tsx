import CompetitionsComponent from '@/components/competitions'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Competitions | Cubing Kerala",
  description: "Upcoming and past competitions of Rubik's Cube community in Kerala",
};

const Competitions = () => {
  return (
    <>
      <CompetitionsComponent />
    </>
  )
}

export default Competitions