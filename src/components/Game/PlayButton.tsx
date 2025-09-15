"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Loader2, PlayIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'

const PlayButton = () => {

    const [creatingGame, setCreatingGame] = useState(false)
    const router = useRouter()
    const { user, isAuthenticating } = useAuth()

    const handlePlay = async () => {
        setCreatingGame(true)
        try {
            const response = await fetch("/api/game/play", {
                method: "GET",
                credentials: "include",
            })

            const game = await response.json()

            if (response.ok) {
                
                console.log(game)
                router.push(`/game/${game._id}`)
            } else throw new Error(game.error || "Failed to create game")
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create game")
        } finally {
            setCreatingGame(false)
        }
    }

    return (
        <Button variant="outline" className='cursor-pointer' onClick={handlePlay} disabled={creatingGame || isAuthenticating || !user}>
            <PlayIcon className='size-4' />
            {isAuthenticating ? <Loader2 className='animate-spin' /> :
                !user ? <p className='flex items-center gap-2'>Login to play</p> :
                    (
                        creatingGame ? (
                            <p className='flex items-center gap-2'><Loader2 className='animate-spin' /> Creating game...</p>
                        ) : (
                            <p className='flex items-center gap-2'>Play</p>
                        ))
            }
        </Button>
    )
}

export default PlayButton