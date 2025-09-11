"use client"

import { ISafeCard } from "@/models/Game.model"
import { Loader2 } from "lucide-react"

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
  const backgroundImage = card.value
    ? `url('/game/${card.value}.png')`
    : "url('/game/unfound.png')"

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative rounded-md bg-cover bg-center aspect-square
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{ backgroundImage }}
    >
      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <Loader2 className="animate-spin text-white w-6 h-6" />
        </div>
      )}
    </div>
  )
}

export default Card
