"use client"

import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'

const DiscordButton = () => {
    const { login, isAuthenticating, user, logout } = useAuth()
    if (isAuthenticating) {
        return null
    }

    return (
        user ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='cursor-pointer bg-discord-blue hover:bg-discord-blue/80'>
                        <Image src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}` : '/discord.png'} alt='Discord Avatar' width={20} height={20} className='rounded-full' onError={(e) => {
                            e.currentTarget.src = '/discord.png'
                        }}/>
                        {user.discordUsername}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <Button onClick={login} className='cursor-pointer bg-discord-blue hover:bg-discord-blue/80'>
                <Image src='/discord.png' alt='Discord Logo' width={20} height={20} className='rounded-full' />
                Login with Discord
            </Button>
        )
    )
}

export default DiscordButton