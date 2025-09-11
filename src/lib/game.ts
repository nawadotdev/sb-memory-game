import { CardStatus, ICard } from "@/models/Game.model";

const values = Array.from({ length: 32 }, (_, i) => (i + 1).toString());

export const generateDeck = (size: number = 8): ICard[] => {
  const gameValues = [...values]
    .sort(() => Math.random() - 0.5)
    .slice(0, size);

  const deck: ICard[] = gameValues.flatMap((value) => [
    { index: -1, value, status: CardStatus.HIDDEN },
    { index: -1, value, status: CardStatus.HIDDEN },
  ]);

  return deck
    .sort(() => Math.random() - 0.5)
    .map((card, index) => ({
      ...card,
      index,
    }));
};
