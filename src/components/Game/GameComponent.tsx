"use client"

import { CardStatus, ISafeGame } from "@/models/Game.model"
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
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <h2 className="text-2xl font-bold">Score: {game.score}</h2>
        <h2 className="text-2xl font-bold">Tries: {game.tries}</h2>
      </div>
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
            matched={card.status === CardStatus.FOUND}
          />
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameComponent
