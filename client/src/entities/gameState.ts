import type { Card } from "./card";
import { createDeck, shuffleDeck } from "./deck";
import {
  getDifficultyByName,
  type Difficulty,
  type DifficultyName,
} from "./difficulty/difficulty";
import { EASY_DIFFICULTY } from "./difficulty/difficulty.config";
import { type GameStatus } from "./gameStatus";
import {
  createPlayersWithHand,
  restartPlayersWithHands,
  type NewPlayerInput,
  type Player,
} from "./player";
import { v4 as uuidv4 } from "uuid";
import { ROUND_ORDER, type RoundType } from "./roundType";

export type GameState = {
  id: string;
  players: Player[];
  deck: Card[];
  gameStatus: GameStatus;
  difficulty: Difficulty;
  currentPlayerIndex: number;
  currentRoundType: RoundType;
};

export function createGame(
  players: NewPlayerInput[],
  difficultyName: DifficultyName,
): GameState {
  let deck: Card[] = createDeck();

  deck = shuffleDeck(deck);

  const createdPlayers: Player[] = createPlayersWithHand(players, deck);

  const difficulty: Difficulty =
    getDifficultyByName(difficultyName) ?? EASY_DIFFICULTY;

  const gameState: GameState = {
    id: uuidv4(),
    players: createdPlayers,
    deck: deck,
    gameStatus: "IN_PROGRESS",
    difficulty: difficulty,
    currentPlayerIndex: 0,
    currentRoundType: "RED_BLACK",
  };

  return gameState;
}

export function restartGame(prevGameState: GameState): GameState {
  const deck: Card[] = createDeck();

  const newGameState: GameState = {
    id: prevGameState.id,
    players: restartPlayersWithHands(prevGameState.players, deck),
    deck: deck,
    gameStatus: "IN_PROGRESS",
    difficulty: prevGameState.difficulty,
    currentPlayerIndex: 0,
    currentRoundType: "RED_BLACK",
  };

  return newGameState;
}

export function getNextTurn(gameState: GameState): GameState {
  if (gameState.gameStatus == "FINISHED") {
    return gameState;
  }

  const isLastPlayer =
    gameState.currentPlayerIndex === gameState.players.length - 1;

  const currentRoundIndex = ROUND_ORDER.indexOf(gameState.currentRoundType);

  const isLastRound = currentRoundIndex === ROUND_ORDER.length - 1;

  if (!isLastPlayer) {
    return {
      ...gameState,
      currentPlayerIndex: gameState.currentPlayerIndex + 1,
    };
  }

  if (!isLastRound) {
    return {
      ...gameState,
      currentPlayerIndex: 0,
      currentRoundType: ROUND_ORDER[currentRoundIndex + 1],
    };
  }

  return {
    ...gameState,
    currentPlayerIndex: 0,
    gameStatus: "FINISHED",
  };
}
