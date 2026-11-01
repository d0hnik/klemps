import { Navigate, useNavigate } from "react-router-dom";
import { getGameState, saveGameState } from "../entities/gameStorage";
import { PlayersTab } from "../components/Players/PlayersTab";
import { BackButton } from "../components/Buttons/backButton/BackButton";
import { useState } from "react";
import { GameSeo } from "../components/SEO/GameSeo";
import { GameField } from "../components/Game/GameField";
import { GuessField } from "../components/Game/GuessField";
import {
  handleGuess,
  type GuessResult,
  type GuessValue,
} from "../entities/guess";
import { getCurrentCardIndex } from "../entities/card";
import { AfterGuessModal } from "../components/Modals/AfterGuessModal";
import { getNextTurn } from "../entities/gameState";

export function GameView() {
  const [gameState, setGameState] = useState(() => getGameState());
  const [revealedCardIndex, setRevealedCardIndex] = useState<number | null>(
    null,
  );
  const [pendingGuessResult, setPendingGuessResult] =
    useState<GuessResult | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isGuessLocked, setIsGuessLocked] = useState(false);

  const makeAGuess = (guess: GuessValue): void => {
    if (!gameState || isGuessLocked) {
      return;
    }
    const currentCardIndex = getCurrentCardIndex(gameState.currentRoundType);

    const result = handleGuess(guess, gameState);

    setIsGuessLocked(true);

    setPendingGuessResult(result);

    setRevealedCardIndex(currentCardIndex);
  };

  const navigate = useNavigate();

  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <GameSeo />
      <div className="mx-auto mb-6 flex max-w-7xl flex-col gap-8 px-3 lg:flex-row lg:items-start">
        <div className="contents lg:flex lg:w-1/3 lg:shrink-0 lg:flex-col lg:gap-6">
          <div className="order-1 lg:order-none">
            <PlayersTab
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
            />
          </div>

          <div className="order-4 lg:order-none">
            <BackButton
              onClick={() => navigate("/")}
              iconSize={40}
              additionalStyle="max-w-full"
            />
          </div>
        </div>

        <div className="contents lg:flex lg:min-w-0 lg:flex-1 lg:flex-col lg:gap-8">
          <div className="order-2 min-w-0 lg:order-none">
            <GameField
              gameState={gameState}
              currentPlayerName={
                gameState.players[gameState.currentPlayerIndex].name
              }
              revealedCardIndex={revealedCardIndex}
              onRevealEnd={() => setIsResultModalOpen(true)}
            />
          </div>
          <div className="order-3 lg:order-none">
            <GuessField
              roundType={gameState.currentRoundType}
              onGuess={makeAGuess}
            />
          </div>
        </div>
      </div>

      {isResultModalOpen && pendingGuessResult && (
        <AfterGuessModal
          onClose={() => {
            const newGameState = getNextTurn(gameState);

            saveGameState(newGameState);
            setGameState(newGameState);

            setIsResultModalOpen(false);
            setPendingGuessResult(null);
            setRevealedCardIndex(null);
            setIsGuessLocked(false);
          }}
          isCorrect={pendingGuessResult.isCorrect}
          gameState={gameState}
        />
      )}
    </>
  );
}
