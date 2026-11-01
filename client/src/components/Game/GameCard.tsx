import { getCardImageSrc, type Card } from "../../entities/card";
import "./game-card.css";

type Props = {
  card: Card;
  revealed: boolean;
  isCurrent: boolean;
  onRevealEnd?: () => void;
};

export function GameCard({ card, revealed, isCurrent, onRevealEnd }: Props) {
  const frontSrc = getCardImageSrc(card, true);
  const backSrc = getCardImageSrc(card, false);

  return (
    <div
      className={`game-card w-full min-w-0 select-none ${
        isCurrent && !revealed ? "active-game-card" : ""
      }`}
    >
      <div
        className={`game-card__inner ${
          revealed ? "game-card__inner--revealed" : ""
        }`}
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform") {
            onRevealEnd?.();
          }
        }}
      >
        <img
          className="game-card__face game-card__face--back scale-150"
          src={backSrc}
          alt="Hidden playing card"
          draggable={false}
        />

        <img
          className="game-card__face game-card__face--front scale-150"
          src={frontSrc}
          alt={`${card.rank} of ${card.suit}`}
          draggable={false}
        />
      </div>
    </div>
  );
}
