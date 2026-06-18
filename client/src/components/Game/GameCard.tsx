import { getCardImageSrc, type Card } from "../../entities/card";
import "./game-card.css";

type Props = {
  card: Card;
  revealed: boolean;
};

export function GameCard({ card, revealed }: Props) {
  const src = getCardImageSrc(card, revealed);

  console.log(src);

  const alt = revealed ? `${card.rank} of ${card.suit}` : "Hidden playing card";

  return (
    <img
      className="w-32 sm:w-42 md:w-52 lg:w-58 h-auto shrink-0 select-none object-contain"
      src={src}
      alt={alt}
      draggable={false}
    />
  );
}
