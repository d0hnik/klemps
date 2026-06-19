import { Title } from "../Title/Title";
import { useTranslation } from "react-i18next";
import type { GameState } from "../../entities/gameState";
import { GameCard } from "./GameCard";

type Props = {
  gameState: GameState;
  currentPlayerName: string;
};

export function GameField({ gameState, currentPlayerName }: Props) {
  const { t } = useTranslation();

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  console.log(currentPlayer.hand);

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
        {currentPlayer.hand.map((card) => (
          <GameCard
            key={`${card.rank}-${card.suit}`}
            card={card}
            revealed={true}
          />
        ))}
      </div>
    </section>
  );
}
