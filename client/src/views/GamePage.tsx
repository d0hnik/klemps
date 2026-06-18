import { Navigate, useNavigate } from "react-router-dom";
import { getGameState, saveGameState } from "../entities/gameStorage";
import { PlayersTab } from "../components/Players/PlayersTab";
import { BackButton } from "../components/Buttons/backButton/BackButton";
import { useState } from "react";
import { GameField } from "../components/Game/GameField";

export function GameView() {
  const [gameState, setGameState] = useState(() => getGameState());

  function handleNextPlayer() {
    setGameState((currentGameState) => {
      if (!currentGameState) {
        return currentGameState;
      }

      const nextPlayerIndex =
        currentGameState.currentPlayerIndex ===
        currentGameState.players.length - 1
          ? 0
          : currentGameState.currentPlayerIndex + 1;

      const updatedGameState = {
        ...currentGameState,
        currentPlayerIndex: nextPlayerIndex,
      };

      saveGameState(updatedGameState);

      return updatedGameState;
    });
  }

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

          <div className="order-3 lg:order-none">
            <BackButton
              onClick={() => navigate("/")}
              iconSize={40}
              additionalStyle="lg:ml-16"
            />
          </div>
        </div>

        <div className="order-2 flex flex-col lg:order-none">
          <GameField
            gameState={gameState}
            currentPlayerName={
              gameState.players[gameState.currentPlayerIndex].name
            }
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleNextPlayer}
        className="mr-16 rounded border border-white/30 bg-white/10 px-6 py-3 text-xl text-white hover:bg-white/20"
      >
        Next Player
      </button>
    </>
  );
}
