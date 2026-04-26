import { RANKS, SUITS, type Card } from "./card";

export function createDeck(): Card[] {
    const deck: Card[] = [];
    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({suit, rank})
        }
    }
    return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

export function dealHand(deck: Card[]): Card[] {
    const hand: Card[] = [];

    for (let i = 0; i < 4; i++) {
        const card = deck.pop();

        if (!card) {
            throw new Error("Deck is empty");
        }

        hand.push(card);
    }

    return hand;
}
