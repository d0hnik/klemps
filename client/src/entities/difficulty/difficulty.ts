import { DIFFICULTIES } from "./difficulty.config";

export type Difficulty = {
    name: DifficultyName,
    drinksPerRound: [number, number, number, number]
}

export const DIFFICULTYNAMES = ["EASY", "HARD"] as const;

export type DifficultyName = typeof DIFFICULTYNAMES[number];

export const getDifficultyByName = (name: DifficultyName): Difficulty | undefined => {
  return DIFFICULTIES.find((d) => d.name === name);
};