import { Navigate } from "react-router-dom";
import { getGameState } from "../entities/gameStorage";
import { Header } from "../components/Header/Header";

export function GameView() {
  const gameState = getGameState();

  if (!gameState) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Header />
    </>
  );
}
