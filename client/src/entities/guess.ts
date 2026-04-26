
export const RED_BLACK_GUESSES = ["RED", "BLACK"] as const;

export const HIGH_LOW_GUESSES = ["HIGHER", "LOWER"] as const;

export const INSIDE_OUTSIDE_GUESSES = ["INSIDE", "OUTSIDE"] as const;

export const SUIT_GUESSES = ["HEART", "DIAMOND", "SPADE", "CLUB"] as const;

export type RedBlackGuessValue = typeof RED_BLACK_GUESSES[number];

export type HighLowGuessValue = typeof HIGH_LOW_GUESSES[number];

export type InsideOutsideGuessValue = typeof INSIDE_OUTSIDE_GUESSES[number];

export type SuitGuessValue = typeof SUIT_GUESSES[number];

export type Guess =
  | {
      roundType: "RED_BLACK";
      value: RedBlackGuessValue;
    }
  | {
      roundType: "HIGH_LOW";
      value: HighLowGuessValue;
    }
  | {
      roundType: "INSIDE_OUTSIDE";
      value: InsideOutsideGuessValue;
    }
  | {
      roundType: "SUIT";
      value: SuitGuessValue;
    };