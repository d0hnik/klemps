import { DIFFICULTY_MAP } from "./difficulty.config";

export type Difficulty = {
    name: DifficultyName,
    drinksPerRound: [number, number, number, number]
}

export const DIFFICULTYNAMES = ["EASY", "HARD"] as const;

export type DifficultyName = typeof DIFFICULTYNAMES[number];

export const getDifficultyByName = (name: DifficultyName): Difficulty => {
  return DIFFICULTY_MAP[name];
};