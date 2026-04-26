export const GAMESTATUSES = ["SETUP", "IN_PROGRESS", "FINISHED"] as const;


export type GameStatus = typeof GAMESTATUSES[number];