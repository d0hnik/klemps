import { Navigate, useNavigate } from "react-router-dom";
import { getGameState } from "../entities/gameStorage";
import { PlayersTab } from "../components/Players/PlayersTab";
import { BackButton } from "../components/Buttons/backButton/BackButton";

export function GameView() {
  const gameState = getGameState();

  const navigate = useNavigate();

  console.log(gameState);

  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="flex flex-row justify-evenly">
        <PlayersTab players={gameState.players} />
      </div>
      <div className="flex flex-row justify-between mt-10">
        <BackButton
          onClick={() => navigate("/")}
          iconSize={40}
          additionalStyle={"ml-16"}
        />
      </div>
    </>
  );
}
