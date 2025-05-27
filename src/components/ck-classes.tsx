import React, { Suspense } from 'react'
import BeginnerVideosSection from './beginnerVideos'
import IntermediateVideosSection from './intermediateVideos'
import AdvancedVideosSection from './advancedVideos'
import LearnLoading from '../app/learn/loading'

const Learn = () => {
  return (
   <Suspense fallback={<LearnLoading/>}>
      <div>
        <BeginnerVideosSection/>
        <IntermediateVideosSection/>
        <AdvancedVideosSection/>
      </div>
   </Suspense>
  )
}

export default Learn

