export const ROUNDTYPES = [
  "RED_BLACK",
  "HIGH_LOW",
  "INSIDE_OUTSIDE",
  "SUIT",
] as const;

export type RoundType = (typeof ROUNDTYPES)[number];

export const ROUND_ORDER = [
  "RED_BLACK",
  "HIGH_LOW",
  "INSIDE_OUTSIDE",
  "SUIT",
] as const;
