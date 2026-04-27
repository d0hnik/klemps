import type { Card } from "./card";
import { v4 as uuidv4 } from "uuid";
import { dealHand } from "./deck";

export type Player = {
    id: string,
    name: string,
    drinksGiven: number,
    drinksTaken: number,
    hand: Card[],
}

export function createPlayersFromNames(playerNames: string[], deck: Card[]): Player[] {
    const players: Player[] = [];

    for (const playerName of playerNames) {
        players.push(createPlayerFromName(playerName, deck))
    }

    return players;
}

export function createPlayerFromName(playerName: string, deck: Card[]): Player {
    const newPlayer: Player = {
        id: uuidv4(),
        name: playerName,
        drinksGiven: 0,
        drinksTaken: 0,
        hand: dealHand(deck)
    }

    return newPlayer;
}
