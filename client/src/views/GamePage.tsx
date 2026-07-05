import { Navigate, useNavigate } from "react-router-dom";
import { getGameState, saveGameState } from "../entities/gameStorage";
import { PlayersTab } from "../components/Players/PlayersTab";
import { BackButton } from "../components/Buttons/backButton/BackButton";
import { useState } from "react";
import { GameField } from "../components/Game/GameField";
import { GuessField } from "../components/Game/GuessField";
import {
  handleGuess,
  type GuessResult,
  type GuessValue,
} from "../entities/guess";
import { getCurrentCardIndex } from "../entities/card";
import { AfterGuessModal } from "./AfterGuessModal";
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
      <div className="flex flex-col gap-4 lg:w-fit lg:flex-row lg:items-center">
        <div className="contents lg:flex lg:flex-col">
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
              additionalStyle="lg:ml-16"
            />
          </div>
        </div>

        <div className="contents lg:flex lg:flex-col">
          <div className="order-2 flex flex-col lg:order-none items-center">
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
