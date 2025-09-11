"use client"

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

const PlayButton = () => {

    const [creatingGame, setCreatingGame] = useState(false)
    const router = useRouter()

    const handlePlay = async () => {
        setCreatingGame(true)
        try{
            const response = await fetch("/api/game/play")
            if(response.ok){
                const game = await response.json()
                console.log(game)
                router.push(`/game/${game._id}`)
            } else throw new Error("Failed to create game")
        } catch {
            toast.error("Failed to create game")
        } finally {
            setCreatingGame(false)
        }
    }

    return (
        <Button variant="outline" className='cursor-pointer' onClick={handlePlay} disabled={creatingGame}>
            {creatingGame ? (
                <p className='flex items-center gap-2'><Loader2 className='animate-spin' /> Creating game...</p>
            ) : (
                <p className='flex items-center gap-2'>Play</p>
            )}
        </Button>
    )
}

export default PlayButton