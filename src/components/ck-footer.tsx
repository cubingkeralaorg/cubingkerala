import Link from 'next/link'
import React from 'react'


const CubingKeralaFooter = () => {
    return (
        <footer className="py-6 px-4 sm:px-6 text-stone-400 flex justify-between items-center">
            <div className="space-y-1 w-full">
                <p className="text-xs text-stone-600">Created by <Link href="https://github.com/allenjohn07" className="hover:underline hover:underline-offset-2 cursor-pointer hover:text-blue-500">Allen</Link></p>
                <div className='flex items-center justify-between'>
                    <p className="text-xs">&copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.</p>
                    <Link href="https://github.com/cubingkeralaorg/cubingkerala"><p className='text-stone-400 hover:text-blue-500 hover:underline hover:underline-offset-2 cursor-pointer text-xs hidden md:block'>Github</p></Link>
                </div>
            </div>
        </footer>
    )
}

export default CubingKeralaFooter