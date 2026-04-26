export const GAMESTATUSES = ["SETUP", "IN_PROGRESS", "FINISHED"] as const;


export type GameSatus = typeof GAMESTATUSES[number];