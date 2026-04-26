import type { Card } from "./card";

export type Player = {
    id: string,
    name: string,
    drinksGiven: number,
    drinksTaken: number,
    hand: Card[],
}