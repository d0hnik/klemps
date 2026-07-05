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
      className="container-border relative box-border w-[98%] sm:w-full min-h-fit rounded-xl pb-4 pt-10 sm:px-6 sm:pb-6 sm:pt-12"
      aria-labelledby="game-field-heading"
    >
      <Title
        id="game-field-heading"
        title={`${currentPlayerName.toUpperCase()} ${t("game.currentTurn")}`}
        level={2}
        variant="special"
      />

      <div className="flex flex-row w-full flex-wrap items-center justify-center sm:justify-between">
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
