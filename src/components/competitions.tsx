'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LoadingComponent from './loading';


const UpPastDynamicComponent = dynamic(() => import('../components/up-past-competitions'), {
  ssr: false,
});

export default function CompetitionsComponent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setLoading(false);
  }, []);

  if (loading) return <div className="text-stone-400"><LoadingComponent/></div>;

  return (
    <div className="w-full bg-neutral-950 mx-auto py-6 md:py-8 px-4 md:px-5 text-stone-200">
      <UpPastDynamicComponent />
    </div>
  );
}
