import { rankValue, RED_SUITS, type Card } from "./card";
import { getNextTurn, type GameState } from "./gameState";
import { ROUND_ORDER, type RoundType } from "./roundType";

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
  buttonColor: string;
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
        buttonColor: "var(--color-red)",
      },
      {
        value: "BLACK",
        labelKey: "guess.value.BLACK",
        buttonColor: "var(--color-green)",
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
        buttonColor: "var(--color-red)",
      },
      {
        value: "LOWER",
        labelKey: "guess.value.LOWER",
        buttonColor: "var(--color-red)",
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
        buttonColor: "var(--color-red)",
      },
      {
        value: "OUTSIDE",
        labelKey: "guess.value.OUTSIDE",
        buttonColor: "var(--color-red)",
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
        buttonColor: "var(--color-red)",
      },
      {
        value: "DIAMOND",
        labelKey: "guess.value.DIAMOND",
        buttonColor: "var(--color-red)",
      },
      {
        value: "SPADE",
        labelKey: "guess.value.SPADE",
        buttonColor: "var(--color-red)",
      },
      {
        value: "CLUB",
        labelKey: "guess.value.CLUB",
        buttonColor: "var(--color-red)",
      },
    ],
    isCorrect: isSuitGuessCorrect,
  },
} satisfies RoundConfigMap;

export type GuessResult = {
  gameState: GameState;
  isCorrect: boolean;
};

export function handleGuess(guess: Guess, gameState: GameState): GuessResult {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (!currentPlayer) {
    return {
      gameState,
      isCorrect: false,
    };
  }

  const currentCard =
    currentPlayer.hand[ROUND_ORDER.indexOf(gameState.currentRoundType)];

  if (!currentCard) {
    return {
      gameState,
      isCorrect: false,
    };
  }

  const roundProperties = ROUND_CONFIG[guess.roundType];

  const isCorrect = roundProperties.isCorrect(guess as never, {
    currentCard,
    playerHand: currentPlayer.hand,
  });

  const newGameState = getNextTurn(gameState);

  return {
    isCorrect,
    gameState: newGameState,
  };
}
