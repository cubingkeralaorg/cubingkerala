"use client";

import { useEffect, useRef } from 'react';
import lottie, { AnimationItem } from 'lottie-web';

export default function LottieComponent({path} : {
    path: string
}) {
  const animationContainer = useRef<HTMLDivElement | null>(null);
  const animationInstance = useRef<AnimationItem | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      // Destroy any existing animation to prevent duplication
      if (animationInstance.current) {
        animationInstance.current.destroy();
      }

      // Load the animation
      animationInstance.current = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path,
      });
    }

    // Cleanup on component unmount
    return () => {
      if (animationInstance.current) {
        animationInstance.current.destroy();
        animationInstance.current = null;
      }
    };
  }, [path]);

  return <div ref={animationContainer}></div>;
}
