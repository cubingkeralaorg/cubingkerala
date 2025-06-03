'use client';

import dynamic from 'next/dynamic';


const UpPastDynamicComponent = dynamic(() => import('../components/up-past-competitions'), {
  ssr: false,
});

export default function CompetitionsComponent() {

  return (
    <div className="w-full bg-neutral-950 mx-auto py-6 md:py-8 px-4 md:px-5 text-stone-200">
      <UpPastDynamicComponent />
    </div>
  );
}
