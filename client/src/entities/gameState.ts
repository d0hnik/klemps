import type { Card } from "./card";
import { createDeck } from "./deck";
import { getDifficultyByName, type Difficulty, type DifficultyName } from "./difficulty/difficulty";
import { EASY_DIFFICULTY } from "./difficulty/difficulty.config";
import { type GameStatus } from "./gameStatus";
import { createPlayersFromNames, type Player } from "./player";
import type { RoundType } from "./roundType";
import { v4 as uuidv4 } from "uuid";


export type GameState = {
    id: string,
    players: Player[],
    deck: Card[],
    gameStatus: GameStatus,
    difficulty: Difficulty,
    currentPlayerIndex: number,
    currentRoundType: RoundType
}

export function createGame(playerNames: string[], difficultyName: DifficultyName): GameState {

    const deck: Card[] = createDeck();

    const players: Player[] = createPlayersFromNames(playerNames, deck);

    const difficulty: Difficulty = getDifficultyByName(difficultyName) ?? EASY_DIFFICULTY;

    const gameState: GameState = {
        id: uuidv4(),
        players: players,
        deck: deck,
        gameStatus: "SETUP",
        difficulty: difficulty,
        currentPlayerIndex: 0,
        currentRoundType: "RED_BLACK"
    }

    return gameState;

}