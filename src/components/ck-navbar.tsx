'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import cookie from "cookie"
import { UserInfo } from '@/types/types'
import { Profile } from './profile'
import { useRouter } from 'next/navigation'

const CubingKeralaNavbar = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const cookies = cookie.parse(document.cookie);
    const userInfoFromCookie = cookies.userInfo;
    if (userInfoFromCookie) {
      setUserInfo(JSON.parse(userInfoFromCookie));
    }
  }, []);

  return (
    <header style={{zIndex: '10000'}} className="bg-black text-stone-200 shadow-sm py-2 px-1 md:px-0 sticky top-0">
      <div className="container space-y-3 md:space-y-0 md:flex items-center justify-between h-20 md:h-18 py-2 md:py-6 px-4 md:px-6">
        <Link href="/" className="flex items-center justify-start gap-2" prefetch={true}>
          <CuboidIcon className="w-6 h-6" />
          <span className="text-lg font-semibold">Cubing Kerala</span>
        </Link>
        <nav className="flex items-center justify-between gap-6">
          <Link href="/competitions" className="text-sm font-medium hover:underline underline-offset-4" prefetch={true}>
            Competitions
          </Link>
          <Link href="/members" className="text-sm font-medium hover:underline underline-offset-4" prefetch={true}>
            Members
          </Link>
          <Link href="/rankings" className="text-sm font-medium hover:underline underline-offset-4" prefetch={true}>
            Rankings
          </Link>
          {
            userInfo == null ? (
              <Link
                href="/login"
                className="text-sm font-medium hover:underline underline-offset-4 mr-1"
                prefetch={true}
              >
                Login
              </Link>
            ) : (
              <Profile profileInfo={userInfo} handleLogout={handleLogout} />
            )
          }
        </nav>
      </div>
    </header>
  );

  async function handleLogout() {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  
    if (response.ok) {
      window.localStorage.clear();
      setUserInfo(null); 
      router.push('/login'); 
    } else {
      console.error('Logout failed');
    }
  }
}

function CuboidIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z" />
      <path d="M10 22v-8L2.25 9.15" />
      <path d="m10 14 11.77-6.87" />
    </svg>
  )
}

export default CubingKeralaNavbar;
