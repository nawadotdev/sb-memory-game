"use client"

import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const DiscordButton = ({ textHidden }: { textHidden?: boolean }) => {
    const { login, isAuthenticating, user, logout } = useAuth()
    if (isAuthenticating) {
        return null
    }

    const textHiddenClass = textHidden === true ? "hidden" : textHidden === false ? "block" : "hidden md:block"
    console.log(textHiddenClass)

    return (
        user ? (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className='cursor-pointer bg-discord-blue hover:bg-discord-blue/80 md:text-base text-sm'>
                        <Image src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}` : '/discord.png'} alt='Discord Avatar' width={20} height={20} className='rounded-full' onError={(e) => {
                            e.currentTarget.src = '/discord.png'
                        }}/>
                        {/* if textHidden is true, hide the text. if textHidden is false. if it's undefined, leave it as is */}
                        <span className={cn(textHiddenClass)}>{user.discordUsername}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <Button onClick={login} className='cursor-pointer bg-discord-blue hover:bg-discord-blue/80 md:text-base text-sm'>
                <Image src='/discord.png' alt='Discord Logo' width={20} height={20} className='rounded-full' />
                <span className={cn(textHiddenClass)}>Login with Discord</span>
            </Button>
        )
    )
}

export default DiscordButton