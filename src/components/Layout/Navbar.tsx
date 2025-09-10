import Image from 'next/image'
import React from 'react'
import DiscordButton from './DiscordButton'

const Navbar = () => {

    return (
        <div className="bg-solbabe-purple backdrop-blur-sm w-screen min-w-screen h-16 py-2 px-8 flex items-center justify-between">
            <div className="flex items-center gap-2 h-16">
                <Image src="/photos/sblogo.jpg" alt="SolBabes" width={400} height={400} className="h-full w-fit" />
                <p className="text-white text-2xl font-bold italic">Memory Game</p>
            </div>
            <DiscordButton />
        </div>
    )
}

export default Navbar