// TODO: In next ticket will get the gameState from the localStorage

import { useNavigate } from "react-router-dom";
import { getGameState } from "../entities/gameStorage";

export function GameView() {
  const navigate = useNavigate();

  const gameState = getGameState();

  if (!gameState) {
    navigate("/");
  }

  return <section className="difficulty-tab">GAME TIMEEEE</section>;
}
