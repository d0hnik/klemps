export const SUITS = ["HEART", "DIAMOND", "SPADE", "CLUB"] as const;

export const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"] as const;

export type Suit = typeof SUITS[number];

export type Rank = typeof RANKS[number];

export type Card = {
    suit: Suit,
    rank: Rank
}

export const RED_SUITS: Suit[] = ["HEART", "DIAMOND"];

export const isRed = (suit: Suit) => RED_SUITS.includes(suit);

export const rankValue = (rank: Rank): number => {
    return RANKS.indexOf(rank);
}
