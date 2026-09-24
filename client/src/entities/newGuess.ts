import { RED_SUITS, type Card } from "./card";

export const RED_BLACK_GUESSES = ["RED", "BLACK"] as const;
export const HIGH_LOW_GUESSES = ["HIGHER", "LOWER"] as const;
export const INSIDE_OUTSIDE_GUESSES = ["INSIDE", "OUTSIDE"] as const;
export const SUIT_GUESSES = ["HEART", "DIAMOND", "SPADE", "CLUB"] as const;

export type RedBlackGuessValue = (typeof RED_BLACK_GUESSES)[number];
export type HighLowGuessValue = (typeof HIGH_LOW_GUESSES)[number];
export type InsideOutsideGuessValue = (typeof INSIDE_OUTSIDE_GUESSES)[number];
export type SuitGuessValue = (typeof SUIT_GUESSES)[number];

type GuessCheckContext = {
  currentCard: Card;
  playerHand: Card[];
};

export type GuessValueByRoundType = {
  RED_BLACK: RedBlackGuessValue;
  HIGH_LOW: HighLowGuessValue;
  INSIDE_OUTSIDE: InsideOutsideGuessValue;
  SUIT: SuitGuessValue;
};

type GuessFunctionByRoundType = {
  [RoundType in keyof GuessValueByRoundType]: (
    guessValue: GuessValueByRoundType[RoundType],
    context: GuessCheckContext,
  ) => boolean;
};

const GUESS_FUNCTION_BY_ROUND_TYPE: GuessFunctionByRoundType = {
  RED_BLACK: isRedBlackGuessCorrect,
};

function isRedBlackGuessCorrect(
  guessValue: RedBlackGuessValue,
  { currentCard }: GuessCheckContext,
): boolean {
  const actualColor = RED_SUITS.includes(currentCard.suit) ? "RED" : "BLACK";

  return guessValue === actualColor;
}
