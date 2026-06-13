import { Navigate, useNavigate } from "react-router-dom";
import { getGameState, saveGameState } from "../entities/gameStorage";
import { PlayersTab } from "../components/Players/PlayersTab";
import { BackButton } from "../components/Buttons/backButton/BackButton";
import { useState } from "react";

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
      <div className="flex flex-row justify-evenly">
        <PlayersTab
          players={gameState.players}
          currentPlayerIndex={gameState.currentPlayerIndex}
        />
      </div>
      <div className="flex flex-row justify-between mt-10">
        <BackButton
          onClick={() => navigate("/")}
          iconSize={40}
          additionalStyle={"ml-16"}
        />
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
