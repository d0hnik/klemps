use rand::seq::SliceRandom;
use strum::IntoEnumIterator;

use crate::domain::card::{Card, Rank, Suit};

pub struct Deck {
    cards: Vec<Card>,
}

impl Deck {
    pub fn new() -> Self {
        let mut cards = Vec::with_capacity(52);

        for suit in Suit::iter() {
            for rank in Rank::iter() {
                cards.push(Card::new(suit, rank));
            }
        }

        Self { cards }
    }

    pub fn new_shuffled() -> Self {
        let mut deck = Self::new();
        deck.shuffle();
        deck
    }

    pub fn shuffle(&mut self) {
        self.cards.shuffle(&mut rand::rng());
    }

    pub fn draw(&mut self) -> Option<Card> {
        self.cards.pop()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::HashSet;

    #[test]
    fn new_deck_has_52_cards() {
        let deck = Deck::new();

        assert_eq!(deck.cards.len(), 52);
    }

    #[test]
    fn new_deck_has_unique_cards() {
        let deck = Deck::new();

        let unique_cards: HashSet<_> = deck.cards.iter().collect();

        assert_eq!(unique_cards.len(), 52);
    }

    #[test]
    fn drawing_reduces_deck_size() {
        let mut deck = Deck::new();

        let card = deck.draw();

        assert!(card.is_some());
        assert_eq!(deck.cards.len(), 51);
    }

    #[test]
    fn drawing_all_cards_produces_no_duplicates() {
        let mut deck = Deck::new_shuffled();
        let mut drawn_cards = HashSet::new();

        for _ in 0..52 {
            let card = deck.draw().expect("Deck should contain 52 cards");

            assert!(drawn_cards.insert(card), "Duplicate card drawn");
        }

        assert_eq!(drawn_cards.len(), 52);
        assert!(deck.cards.is_empty());
    }

    #[test]
    fn drawing_from_empty_deck_returns_none() {
        let mut deck = Deck::new();

        for _ in 0..52 {
            deck.draw();
        }

        assert!(deck.draw().is_none());
        assert!(deck.cards.is_empty());
    }
}
