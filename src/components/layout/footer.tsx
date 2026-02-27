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
        <footer className="py-6 px-6 text-muted-foreground flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-t border-border mt-auto">
            <p className="text-xs">&copy; {new Date().getFullYear()} Cubing Kerala. All rights reserved.</p>
            <p className="text-xs text-muted-foreground/60">Designed & Developed with ❤️ by <span onClick={() => handleLinkRedirect()} className="cursor-pointer hover:text-primary transition-all duration-200 ease-in font-medium">Allen John</span></p>
        </footer>
    )
}

export default CubingKeralaFooter