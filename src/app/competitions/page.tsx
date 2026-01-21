import CompetitionsPage from '@/components/competitionsComponent';
import { Metadata } from 'next';
import React from 'react'
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Competitions | Cubing Kerala",
  description: "Upcoming and past competitions of Rubik's Cube community in Kerala",
};

const Competitions = async () => {

  return (
      <CompetitionsPage/>
  )
}

export default Competitions