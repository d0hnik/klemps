import type { Difficulty } from "./difficulty";

export const EASY_DIFFICULTY: Difficulty = {
    name: "EASY",
    drinksPerRound: [1, 2, 3, 4]
}

export const HARD_DIFFICULTY: Difficulty = {
    name: "HARD",
    drinksPerRound: [2, 4, 6, 8]
}

export const DIFFICULTIES: Difficulty[] = [
  EASY_DIFFICULTY,
  HARD_DIFFICULTY,
];