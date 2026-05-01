import { describe, it, expect } from "vitest";
import { createDeck, dealHand } from "../../entities/deck";

describe("createDeck", () => {
    it("should contain 52 unique cards", () => {
        const deck = createDeck();

        const unique = new Set(deck.map(card => `${card.rank}-${card.suit}`));

        expect(unique.size).toBe(52);
    });

    it("should contain 48 cards after dealing hand", () => {
        const deck = createDeck();

        const unique = new Set(deck.map(card => `${card.rank}-${card.suit}`));

        expect(unique.size).toBe(52);

        const hand = dealHand(deck);

        expect(hand.length).toBe(4);

        expect(deck.length).toBe(48);

    });
});