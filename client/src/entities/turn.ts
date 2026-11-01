import { getNextTurn, type GameState } from "./gameState";
import { ROUND_ORDER } from "./roundType";

export type DrinkAllocation = Record<string, number>;

export function getDrinksForRound(gameState: GameState): number {
  return gameState.difficulty.drinksPerRound[ROUND_ORDER.indexOf(gameState.currentRoundType)];
}

export function completeTurn(gameState: GameState, isCorrect: boolean, allocation: DrinkAllocation = {}): GameState {
  if (gameState.gameStatus !== "IN_PROGRESS") {
    throw new Error("The game is not in progress.");
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const drinks = getDrinksForRound(gameState);

  if (isCorrect) {
    const entries = Object.entries(allocation);
    const invalidRecipient = entries.some(([id, count]) => {
      const recipientExists = gameState.players.some((player) => player.id === id);
      return !Number.isInteger(count) || count < 0 || id === currentPlayer.id || !recipientExists;
    });
    const total = entries.reduce((sum, [, count]) => sum + count, 0);
    if (invalidRecipient || total !== drinks) {
      throw new Error("Assign all drinks to other players before continuing.");
    }
  }

  const players = gameState.players.map((player) => {
    const isCurrentPlayer = player.id === currentPlayer.id;
    let taken = 0;
    if (isCorrect) taken = allocation[player.id] || 0;
    else if (isCurrentPlayer) taken = drinks;

    return {
      ...player,
      drinksGiven: player.drinksGiven + (isCorrect && isCurrentPlayer ? drinks : 0),
      drinksTaken: player.drinksTaken + taken,
    };
  });

  return getNextTurn({ ...gameState, players });
}
