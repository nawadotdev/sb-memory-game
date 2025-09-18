"use client"

import { CardStatus, GameStatus, ISafeGame } from "@/models/Game.model"
import Card from "./Card"
import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const GameComponent = ({
  game,
  onFlip,
  isProcessingFlip,
  flippingIndex,
}: {
  game: ISafeGame
  onFlip: (index: number) => void
  isProcessingFlip: boolean
  flippingIndex?: number
}) => {

  const [timeLeft, setTimeLeft] = useState<number>(20)
  const [isCompleted, setIsCompleted] = useState<boolean>(game.status === GameStatus.COMPLETED)

  useEffect(() => {
    if (!game.endTime) {
      setTimeLeft(20)
      setIsCompleted(false)
      return
    }

    const update = () => {
      const diff = Math.floor((game.endTime! - Date.now()) / 1000)
      setTimeLeft(diff > 0 ? diff : 0)
    }

    update()
    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [game.endTime])

  return (
    <div className="relative w-full">
      <div className={cn("w-full flex flex-col items-center md:gap-12 gap-2 relative", game.status === GameStatus.COMPLETED && "opacity-50")}>
        <div className="flex md:gap-12 gap-4 items-center justify-center text-center">
          <h2 className="text-2xl font-bold">Attempt: {game.attempt} </h2>
          <h2 className="text-2xl font-bold">Score: {game.score}</h2>
          <h2 className="text-2xl font-bold">Time Left: {timeLeft.toFixed(0)}s</h2>
        </div>
        <div
          className="flex flex-wrap gap-2 w-[90%] h-full justify-center"
        >
          {game.cards.map((card, index) => (
            <div key={index} className="basis-1/4 md:basis-1/5 xl:basis-1/7">
              <Card
                card={card}
                onClick={() => onFlip(index)}
                disabled={isProcessingFlip || isCompleted}
                loading={flippingIndex === index}
                matched={card.status === CardStatus.FOUND}
              />
            </div>
          ))}
        </div>
      </div>
      {isCompleted || timeLeft === 0 && (
        <Image src="/game/finish.png" alt="Completed" width={400} height={400} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-2xl border-1 border-white" />
      )}
    </div>
  )
}

export default GameComponent
