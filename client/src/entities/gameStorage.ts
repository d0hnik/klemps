import type { GameState } from "./gameState";

const GAME_STORAGE_KEY = "klemps-local-game-state";

export function saveGameState(gameState: GameState) {
  localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(gameState));
}

export function getGameState(): GameState | null {
  const savedGameStates = localStorage.getItem(GAME_STORAGE_KEY);

  if (!savedGameStates) {
    return null;
  }

  try {
    return JSON.parse(savedGameStates) as GameState;
  } catch {
    clearGameState();
    return null;
  }
}

export function clearGameState(): void {
  localStorage.removeItem(GAME_STORAGE_KEY);
}
