"use client"

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
  const src = card.value
    ? `/game/${card.value}.png`
    : `/game/unfound.png`

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`relative rounded-md aspect-square overflow-hidden
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Image
        src={src}
        alt="Card"
        fill   // parent div `relative` olduğu için tüm alanı kaplar
        className="object-cover"
        sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 100px"
        priority={!!card.value} // ilk açılışta kritik olanlar hızlı yüklensin
      />

      {loading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <Loader2 className="animate-spin text-white w-6 h-6" />
        </div>
      )}
    </div>
  )
}

export default Card
