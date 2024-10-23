import Link from 'next/link'
import React from 'react'
import { FaGithub } from "react-icons/fa";



const CubingKeralaFooter = () => {
    return (
        <footer className="py-6 px-4 sm:px-6 text-stone-400 flex justify-between items-center">
            <div className="space-y-1 w-full">
                <p className="text-xs text-stone-600">Created by <Link href="https://www.allenjohn.online" className="cursor-pointer hover:text-blue-500">allenjohn</Link></p>
                <div className='flex items-center justify-between'>
                    <p className="text-xs">&copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.</p>
                    <Link href="https://github.com/cubingkeralaorg/cubingkerala">
                        <p className='text-stone-600 hover:text-blue-500 cursor-pointer text-xs hidden md:flex gap-1 items-center'>
                            <FaGithub className='text-xs' />
                            github
                        </p>
                        <FaGithub className='text-stone-600 hover:text-blue-500 cursor-pointer text-xs md:hidden mr-1' />
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default CubingKeralaFooter