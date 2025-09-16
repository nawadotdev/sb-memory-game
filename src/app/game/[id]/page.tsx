"use client"

import { ISafeGame } from "@/models/Game.model"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import GameComponent from "@/components/Game/GameComponent"
import { useAuth } from "@/context/AuthContext"

let socket: WebSocket | null = null
const WS_URL = process.env.NEXT_PUBLIC_SOCKET_URL

const GamePage = () => {
  const { token } = useAuth()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [game, setGame] = useState<ISafeGame | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [isProcessingFlip, setIsProcessingFlip] = useState(false)
  const [flippingIndex, setFlippingIndex] = useState<number | undefined>()

  useEffect(() => {
    if (!token) return

    socket = new WebSocket(`${WS_URL}?token=${token}`)

    socket.onopen = () => {

      socket?.send(JSON.stringify({ type: "join", payload: { gameId: id } }))
    }

    socket.onmessage = (event) => {
      try {
        const { type, payload } = JSON.parse(event.data)

        if (type === "state") {
          setGame(payload as ISafeGame)
          setLoading(false)

          setIsProcessingFlip(false)
          setFlippingIndex(undefined)
        }

        if (type === "error_message") {
          toast.error(payload)
          setIsProcessingFlip(false)
          setFlippingIndex(undefined)
        }
      } catch (err) {
        console.error("Invalid message:", event.data)
        setIsProcessingFlip(false)
        setFlippingIndex(undefined)
      }
    }

    return () => {
      socket?.close()
    }
  }, [id, token])

  const handleFlip = (cardIndex: number) => {
    if (!game || isProcessingFlip || !socket) return

    setIsProcessingFlip(true)
    setFlippingIndex(cardIndex)

    socket.send(JSON.stringify({ type: "flip", payload: { gameId: id, cardIndex } }))
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {loading ? (
        <p>Loading...</p>
      ) : game ? (
        <GameComponent
          game={game}
          onFlip={handleFlip}
          isProcessingFlip={isProcessingFlip}
          flippingIndex={flippingIndex}
        />
      ) : (
        <p>Game not found</p>
      )}
    </div>
  )
}

export default GamePage
