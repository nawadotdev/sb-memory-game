"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { IGame } from "@/models/Game.model"

const GameComponent = (props: { game?: IGame }) => {
    const { game } = props

    if (!game) return <p>Game not found</p>

    return (
        <div>
            <h1>Game {game._id.toString()}</h1>
        </div>
    )
}

const GamePage = () => {
    const params = useParams<{ id: string }>();
    const id = params.id

    const [game, setGame] = useState<IGame | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchGame = async () => {
            try{
                const resp = await fetch(`/api/game/${id}`, { credentials: "include" } )
                if(resp.ok){
                    const game = await resp.json()
                    setGame(game)
                } else throw new Error("Failed to fetch game")
            } catch {
                setGame(undefined)
                toast.error("Failed to fetch game")
            } finally {
                setLoading(false)
            }
        }
        fetchGame()
    }, [id])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <GameComponent game={game} />
            )}
        </div>
    )
}

export default GamePage