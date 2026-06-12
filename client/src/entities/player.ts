import type { Card } from "./card";
import { v4 as uuidv4 } from "uuid";
import { dealHand } from "./deck";

export type Player = {
  id: string;
  name: string;
  drinksGiven: number;
  drinksTaken: number;
  hand: Card[];
  avatarSrc: string;
};

export type NewPlayerInput = {
  name: string;
  avatarSrc: string;
};

export function createPlayersWithHand(
  players: NewPlayerInput[],
  deck: Card[],
): Player[] {
  const createdPlayers: Player[] = [];

  for (const player of players) {
    createdPlayers.push(createPlayer(player, deck));
  }

  return createdPlayers;
}

export function createPlayer(player: NewPlayerInput, deck: Card[]): Player {
  const newPlayer: Player = {
    id: uuidv4(),
    name: player.name,
    drinksGiven: 0,
    drinksTaken: 0,
    hand: dealHand(deck),
    avatarSrc: player.avatarSrc,
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
    avatarSrc: player.avatarSrc,
  };

  return restartedPlayer;
}

export const PLAYER_AVATARS = [
  "/players/avatar1.png",
  "/players/avatar2.png",
  "/players/avatar3.png",
  "/players/avatar4.png",
] as const;

export const PLAYER_COLORS = [
  {
    color: "#e94b5e",
  },
  {
    color: "#ffd91a",
  },
  {
    color: "#44d07b",
  },
  {
    color: "#4da3ff",
  },
] as const;

export type PlayerAvatar = (typeof PLAYER_AVATARS)[number];
