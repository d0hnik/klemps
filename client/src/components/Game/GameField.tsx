import { Title } from "../Title/Title";
import { useTranslation } from "react-i18next";
import type { GameState } from "../../entities/gameState";
import { GameCard } from "./GameCard";
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
      className="container-border relative w-full min-w-0 rounded-xl px-3 pt-10 pb-4 sm:px-6 sm:pt-12 sm:pb-6"
      aria-labelledby="game-field-heading"
    >
      <Title
        id="game-field-heading"
        className="max-w-full"
        title={`${currentPlayerName.toUpperCase()} ${t("game.currentTurn")}`}
        level={2}
        variant="special"
      />

      <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-4">
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
    </section>
  );
}
