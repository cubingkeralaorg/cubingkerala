'use client'

import React from 'react'
import { FaGithub } from "react-icons/fa";


const handleLinkRedirect = () => {
    window.open("https://allenjohn.vercel.app/", "_blank")
}


const handleGithubRedirect = () => {
    window.open("https://github.com/cubingkeralaorg/cubingkerala", "_blank")
}


const CubingKeralaFooter = () => {
    return (
        <footer className="py-6 px-6 sm:px-6 text-muted-foreground flex justify-center items-center border-t border-border mt-auto">
            <div className="space-y-1 w-full text-center">
                <p className="text-xs text-muted-foreground/60">Created by <span onClick={() => handleLinkRedirect()} className="cursor-pointer hover:text-primary transition-all duration-200 ease-in font-medium">allenjohn</span></p>
                <p className="text-xs">&copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default CubingKeralaFooter