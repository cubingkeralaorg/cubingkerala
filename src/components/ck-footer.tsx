import Link from 'next/link'
import React from 'react'

const CubingKeralaFooter = () => {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-6 items-center justify-end px-4 sm:px-6 text-stone-400">
            <p className="text-xs">&copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.</p>
        </footer>
    )
}

export default CubingKeralaFooter