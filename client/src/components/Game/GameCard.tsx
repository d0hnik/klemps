import { getCardImageSrc, type Card } from "../../entities/card";
import "./game-card.css";
import "../Players/players.css";

type Props = {
  card: Card;
  revealed: boolean;
  isCurrent: boolean;
};

export function GameCard({ card, revealed, isCurrent }: Props) {
  const src = getCardImageSrc(card, revealed);

  const alt = revealed ? `${card.rank} of ${card.suit}` : "Hidden playing card";

  return (
    <img
      className={`w-32 -mx-5 sm:w-40 md:w-52 lg:w-60 h-auto shrink-0 select-none object-contain ${isCurrent ? "active-game-card" : ""}`}
      src={src}
      alt={alt}
      draggable={false}
    />
  );
}
