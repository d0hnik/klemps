import { Navigate } from "react-router-dom";
import { getGameState } from "../entities/gameStorage";

export function GameView() {
  const gameState = getGameState();

  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  return <section className="difficulty-tab">GAME TIMEEEE</section>;
}
