import { Title } from "../Title/Title";
import { useTranslation } from "react-i18next";
import type { GameState } from "../../entities/gameState";
import { GameCard } from "./GameCard";
import { ROUND_ORDER } from "../../entities/roundType";
import { isCardRevealed, isCurrentCard } from "../../entities/card";

type Props = {
  gameState: GameState;
  currentPlayerName: string;
  revealedCardIndex: number | null;
  onRevealEnd: () => void;
};

export function GameField({
  gameState,
  currentPlayerName,
  revealedCardIndex,
  onRevealEnd,
}: Props) {
  const { t } = useTranslation();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  return (
    <section
      className="relative w-full min-w-0"
      aria-labelledby="game-field-heading"
    >
      <Title
        id="game-field-heading"
        className="z-10 max-w-full"
        title={`${t("game.currentTurn")}: ${currentPlayerName.toUpperCase()}`}
        level={2}
        variant="special"
      />

      <div className="secondary-pixel-corners bg-black/15 px-1 pt-8 pb-3 sm:px-3 sm:pt-10">
        <div className="grid grid-cols-4 items-center overflow-hidden py-3 sm:gap-2">
          {currentPlayer.hand.map((card, index) => {
            const revealedByRound = isCardRevealed(
              gameState.currentRoundType,
              index,
            );
            const revealedByCurrentGuess = revealedCardIndex === index;

            const revealed = revealedByRound || revealedByCurrentGuess;

            const isCurrent = isCurrentCard(gameState.currentRoundType, index);
            return (
              <GameCard
                key={`${card.rank}-${card.suit}`}
                card={card}
                revealed={revealed}
                isCurrent={isCurrent}
                onRevealEnd={revealedByCurrentGuess ? onRevealEnd : undefined}
              />
            );
          })}
        </div>
        <p className="mt-2 text-center text-sm text-cyan-100">
          {t("difficulty.round")} {ROUND_ORDER.indexOf(gameState.currentRoundType) + 1} / {ROUND_ORDER.length}
        </p>
      </div>
    </section>
  );
}
