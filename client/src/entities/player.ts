import type { Card } from "./card";
import { v4 as uuidv4 } from "uuid";
import { dealHand } from "./deck";

export type Player = {
  id: string;
  name: string;
  drinksGiven: number;
  drinksTaken: number;
  hand: Card[];
};

export function createPlayersWithHand(
  playerNames: string[],
  deck: Card[],
): Player[] {
  const players: Player[] = [];

  for (const playerName of playerNames) {
    players.push(createPlayerFromNameWithHand(playerName, deck));
  }

  return players;
}

export function createPlayerFromNameWithHand(
  playerName: string,
  deck: Card[],
): Player {
  const newPlayer: Player = {
    id: uuidv4(),
    name: playerName,
    drinksGiven: 0,
    drinksTaken: 0,
    hand: dealHand(deck),
  };

  return newPlayer;
}

export function restartPlayersWithHands(
  players: Player[],
  deck: Card[],
): Player[] {
  const restartedPlayers = [];

  for (const player of players) {
    restartedPlayers.push(restartPlayerWithHand(player, deck));
  }

  return restartedPlayers;
}

export function restartPlayerWithHand(player: Player, deck: Card[]): Player {
  const restartedPlayer: Player = {
    id: player.id,
    name: player.name,
    drinksGiven: 0,
    drinksTaken: 0,
    hand: dealHand(deck),
  };

  return restartedPlayer;
}

export const PLAYER_AVATARS = [
  "/players/guy1.png",
  "/players/guy2.png",
  "/players/guy3.png",
  "/players/guy4.png",
] as const;

export type PlayerAvatar = (typeof PLAYER_AVATARS)[number];
