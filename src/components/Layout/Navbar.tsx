import Image from 'next/image'
import React from 'react'
import DiscordButton from './DiscordButton'
import Link from 'next/link'

const Navbar = () => {

    return (
        <div className="bg-solbabe-purple backdrop-blur-sm w-screen min-w-screen h-[4rem] py-2 px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 h-[4rem]">
                <Image src="/logo.png" alt="SolBabes" width={400} height={400} className="h-full w-fit" />
                <p className="text-white md:text-2xl text-lg font-bold italic">Memory Game</p>
            </Link>
            <DiscordButton />
        </div>
    )
}

export default Navbar