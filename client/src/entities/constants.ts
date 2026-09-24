export const PLAYER_DRINKS_BUTTON_TYPES = ["increment", "decrement"] as const;

export type PlayerDrinksButtonType =
  (typeof PLAYER_DRINKS_BUTTON_TYPES)[number];
