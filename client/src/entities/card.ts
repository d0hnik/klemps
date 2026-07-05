import { ROUND_ORDER, type RoundType } from "./roundType";

export const SUITS = ["SPADE", "CLUB", "HEART", "DIAMOND"] as const;

export const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

export const SPRITE_RANKS = [
  "A",
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const satisfies readonly Rank[];

export type Suit = (typeof SUITS)[number];

export type Rank = (typeof RANKS)[number];

export type Card = {
  suit: Suit;
  rank: Rank;
};

export const RED_SUITS: Suit[] = ["HEART", "DIAMOND"];

export const rankValue = (rank: Rank): number => {
  return RANKS.indexOf(rank);
};

export function getCardImageSrc(card: Card, revealed: boolean) {
  const basePath = `/cards/`;

  if (!revealed) {
    return `${basePath}/back.png`;
  }

  return `${basePath}/${card.rank.toLowerCase()}-${card.suit.toLowerCase()}.png`;
}

export function isCardRevealed(currentRoundType: RoundType, cardIndex: number) {
  const currentRoundIndex = ROUND_ORDER.indexOf(currentRoundType);

  return cardIndex < currentRoundIndex;
}

export function isCurrentCard(currentRoundType: RoundType, cardIndex: number) {
  const currentRoundIndex = ROUND_ORDER.indexOf(currentRoundType);

  return cardIndex == currentRoundIndex;
}

export function getCurrentCardIndex(roundType: RoundType): number {
  return ROUND_ORDER.indexOf(roundType);
}
