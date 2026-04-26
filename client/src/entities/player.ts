import type { Card } from "./card";

type Player = {
    id: string
    name: string,
    drinkGiven: number,
    drinksTaken: number,
    hand: Card[],
    currentCardIndex: number,
}