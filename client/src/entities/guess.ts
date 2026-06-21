import { rankValue, RED_SUITS, type Card } from "./card";
import type { RoundType } from "./roundType";

export const RED_BLACK_GUESSES = ["RED", "BLACK"] as const;
export const HIGH_LOW_GUESSES = ["HIGHER", "LOWER"] as const;
export const INSIDE_OUTSIDE_GUESSES = ["INSIDE", "OUTSIDE"] as const;
export const SUIT_GUESSES = ["HEART", "DIAMOND", "SPADE", "CLUB"] as const;

export type RedBlackGuessValue = (typeof RED_BLACK_GUESSES)[number];
export type HighLowGuessValue = (typeof HIGH_LOW_GUESSES)[number];
export type InsideOutsideGuessValue = (typeof INSIDE_OUTSIDE_GUESSES)[number];
export type SuitGuessValue = (typeof SUIT_GUESSES)[number];

export type GuessValue =
  | RedBlackGuessValue
  | HighLowGuessValue
  | InsideOutsideGuessValue
  | SuitGuessValue;

export type GuessValueByRoundType = {
  RED_BLACK: RedBlackGuessValue;
  HIGH_LOW: HighLowGuessValue;
  INSIDE_OUTSIDE: InsideOutsideGuessValue;
  SUIT: SuitGuessValue;
};

export type Guess<T extends RoundType = RoundType> = {
  [TRound in RoundType]: {
    roundType: TRound;
    value: GuessValueByRoundType[TRound];
  };
}[T];

type GuessCheckContext = {
  currentCard: Card;
  playerHand: Card[];
};

type GuessOption<TValue extends GuessValue> = {
  value: TValue;
  labelKey: string;
};

type RoundConfig<T extends RoundType> = {
  titleKey: string;
  options: readonly GuessOption<GuessValueByRoundType[T]>[];
  isCorrect: (
    guessValue: GuessValueByRoundType[T],
    context: GuessCheckContext,
  ) => boolean;
};

type RoundConfigMap = {
  [T in RoundType]: RoundConfig<T>;
};

function isRedBlackGuessCorrect(
  guessValue: RedBlackGuessValue,
  { currentCard }: GuessCheckContext,
): boolean {
  const actualColor = RED_SUITS.includes(currentCard.suit) ? "RED" : "BLACK";

  return guessValue === actualColor;
}

function isHighLowGuessCorrect(
  guessValue: HighLowGuessValue,
  { currentCard, playerHand }: GuessCheckContext,
): boolean {
  const previousCard = playerHand.at(0);

  if (!previousCard) {
    return false;
  }

  const currentRank = rankValue(currentCard.rank);
  const previousRank = rankValue(previousCard.rank);

  if (guessValue === "HIGHER") {
    return currentRank > previousRank;
  }

  return currentRank < previousRank;
}

function isInsideOutsideGuessCorrect(
  guessValue: InsideOutsideGuessValue,
  { currentCard, playerHand }: GuessCheckContext,
): boolean {
  const firstCard = playerHand.at(0);
  const secondCard = playerHand.at(1);

  if (!firstCard || !secondCard) {
    return false;
  }

  const firstRank = rankValue(firstCard.rank);
  const secondRank = rankValue(secondCard.rank);
  const currentRank = rankValue(currentCard.rank);

  const minRank = Math.min(firstRank, secondRank);
  const maxRank = Math.max(firstRank, secondRank);

  const isInside = currentRank > minRank && currentRank < maxRank;

  if (guessValue === "INSIDE") {
    return isInside;
  }

  return !isInside;
}

function isSuitGuessCorrect(
  guessValue: SuitGuessValue,
  { currentCard }: GuessCheckContext,
): boolean {
  return guessValue === currentCard.suit;
}

export const ROUND_CONFIG = {
  RED_BLACK: {
    titleKey: "guess.title.RED_BLACK",
    options: [
      {
        value: "RED",
        labelKey: "guess.value.RED",
      },
      {
        value: "BLACK",
        labelKey: "guess.value.BLACK",
      },
    ],
    isCorrect: isRedBlackGuessCorrect,
  },

  HIGH_LOW: {
    titleKey: "guess.title.HIGH_LOW",
    options: [
      {
        value: "HIGHER",
        labelKey: "guess.value.HIGHER",
      },
      {
        value: "LOWER",
        labelKey: "guess.value.LOWER",
      },
    ],
    isCorrect: isHighLowGuessCorrect,
  },

  INSIDE_OUTSIDE: {
    titleKey: "guess.title.INSIDE_OUTSIDE",
    options: [
      {
        value: "INSIDE",
        labelKey: "guess.value.INSIDE",
      },
      {
        value: "OUTSIDE",
        labelKey: "guess.value.OUTSIDE",
      },
    ],
    isCorrect: isInsideOutsideGuessCorrect,
  },

  SUIT: {
    titleKey: "guess.title.SUIT",
    options: [
      {
        value: "HEART",
        labelKey: "guess.value.HEART",
      },
      {
        value: "DIAMOND",
        labelKey: "guess.value.DIAMOND",
      },
      {
        value: "SPADE",
        labelKey: "guess.value.SPADE",
      },
      {
        value: "CLUB",
        labelKey: "guess.value.CLUB",
      },
    ],
    isCorrect: isSuitGuessCorrect,
  },
} satisfies RoundConfigMap;
