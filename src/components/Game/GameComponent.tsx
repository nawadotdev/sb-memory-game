"use client"

import { ISafeGame } from "@/models/Game.model"
import Card from "./Card"

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

  return (
    <div className="w-full flex flex-col items-center">
      <h1 className="text-xl font-bold text-center mb-4">Game {game._id}</h1>

      <div
        className="flex flex-wrap gap-2 w-[90%] h-full justify-center"
      >
        {game.cards.map((card, index) => (
          <div key={index} className="basis-1/4 md:basis-1/5 xl:basis-1/7">
          <Card
            card={card}
            onClick={() => onFlip(index)}
            disabled={isProcessingFlip}
            loading={flippingIndex === index}
          />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameComponent
