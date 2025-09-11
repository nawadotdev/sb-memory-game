"use client"

import { ISafeGame } from "@/models/Game.model"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-hot-toast"
import GameComponent from "@/components/Game/GameComponent"

const GamePage = () => {
  const params = useParams<{ id: string }>()
  const id = params.id
  const [game, setGame] = useState<ISafeGame | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [isProcessingFlip, setIsProcessingFlip] = useState(false)
  const [flippingIndex, setFlippingIndex] = useState<number | undefined>()
  const matchTimeout = useRef<NodeJS.Timeout | null>(null)

  const fetchGame = async () => {
    try {
      const resp = await fetch(`/api/game/${id}`, { credentials: "include" })
      if (resp.ok) {
        setGame(await resp.json())
      } else throw new Error("Failed to fetch game")
    } catch {
      toast.error("Failed to fetch game")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGame()
    return () => {
      // cleanup timer
      if (matchTimeout.current) clearTimeout(matchTimeout.current)
    }
  }, [id])

  const handleMatch = async () => {
    if (matchTimeout.current) {
      clearTimeout(matchTimeout.current) // iptal et
      matchTimeout.current = null
    }
    try {
      const matchResp = await fetch(`/api/game/${id}/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      if (matchResp.ok) {
        const matched = (await matchResp.json()) as ISafeGame
        setGame(matched)
      }
    } catch {
      toast.error("Match failed")
    } finally {
      setIsProcessingFlip(false)
      setFlippingIndex(undefined)
    }
  }

  const handleFlip = async (cardIndex: number) => {
    if (!game || isProcessingFlip) return

    const flipped = game.cards.filter((c) => c.status === "flipped")

    // 🔥 3. flip gelirse → önce match tetikle
    if (flipped.length === 2) {
      await handleMatch()
    }

    setIsProcessingFlip(true)
    setFlippingIndex(cardIndex)
    try {
      const resp = await fetch(`/api/game/${id}/flip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cardIndex }),
      })
      if (!resp.ok) throw new Error("Flip failed")
      const updated = (await resp.json()) as ISafeGame
      setGame(updated)

      const flippedNow = updated.cards.filter((c) => c.status === "flipped")
      if (flippedNow.length === 2) {
        // ⏱️ 1 saniye bekle, match planla
        matchTimeout.current = setTimeout(() => {
          handleMatch()
        }, 1000)
        return
      }
    } catch {
      toast.error("Flip failed")
    } finally {
      // sadece 1 kart açıldıysa → hemen unlock
      setIsProcessingFlip(false)
      setFlippingIndex(undefined)
    }
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
