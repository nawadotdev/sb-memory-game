"use client"

import { cn } from "@/lib/utils"
import { ISafeCard } from "@/models/Game.model"
import { Loader2 } from "lucide-react"
import Image from "next/image"

const Card = ({
  card,
  onClick,
  disabled,
  loading,
}: {
  card: ISafeCard
  onClick: () => void
  disabled: boolean
  loading: boolean
}) => {
  const isFlipped = card.status !== "hidden"

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={cn(
        "relative aspect-square perspective",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* BACK FACE */}
        <div className="absolute inset-0 rounded-md overflow-hidden">
          <Image
            src="/game/unfound.png"
            alt="Card back"
            fill
            className="object-cover rounded-md"
            unoptimized
          />
        </div>

        {/* FRONT FACE */}
        {card.value && (
                  <div className="absolute inset-0 rotate-y-180 rounded-md overflow-hidden">
                  <Image
                    src={`/game/${card.value}.png`}
                    alt="Card front"
                    fill
                    className="object-cover rounded-md"
                    priority={!!card.value}
                    unoptimized
                  />
                </div>
        )}
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
          <Loader2 className="animate-spin text-white w-6 h-6" />
        </div>
      )}
    </div>
  )
}

export default Card
