import Link from 'next/link'
import React from 'react'

const CubingKeralaFooter = () => {
    return (
        <footer className="sm:flex-row py-6 px-4 sm:px-6 text-stone-400 space-y-1 text-center md:text-start">
            <p className="text-xs text-stone-600">Created by <Link href="https://github.com/allenjohn07" className="hover:underline hover:underline-offset-2 cursor-pointer hover:text-blue-500">Allen</Link></p>
            <p className="text-xs">&copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.</p>
        </footer>
    )
}

export default CubingKeralaFooter