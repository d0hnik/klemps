import { Navigate } from "react-router-dom";
import { getGameState, saveGameState } from "../entities/gameStorage";
import { PlayersTab } from "../components/Players/PlayersTab";
import { useState, type CSSProperties } from "react";
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

  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <GameSeo />
      <div
        className="mx-auto mb-6 grid max-w-7xl gap-8 px-3 lg:grid-cols-3 lg:items-start"
        style={{ "--border-color": "var(--color-panel)" } as CSSProperties}
      >
        <PlayersTab players={gameState.players} currentPlayerIndex={gameState.currentPlayerIndex} />
        <div className="flex min-w-0 flex-col gap-8 lg:col-span-2">
          <GameField
            gameState={gameState}
            currentPlayerName={gameState.players[gameState.currentPlayerIndex].name}
            revealedCardIndex={revealedCardIndex}
            onRevealEnd={() => setIsResultModalOpen(true)}
          />
          <GuessField roundType={gameState.currentRoundType} onGuess={makeAGuess} />
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
