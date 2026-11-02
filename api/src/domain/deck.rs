use rand::{Rng, seq::SliceRandom};
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
        deck.shuffle(&mut rand::rng());
        deck
    }

    pub fn shuffle(&mut self, rng: &mut impl Rng) {
        self.cards.shuffle(rng);
    }

    pub fn draw(&mut self) -> Option<Card> {
        self.cards.pop()
    }
}

impl Default for Deck {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::{SeedableRng, rngs::StdRng};
    use std::collections::HashSet;

    #[test]
    fn default_deck_has_52_unique_cards() {
        let deck = Deck::default();
        let unique_cards: HashSet<_> = deck.cards.iter().collect();

        assert_eq!(deck.cards.len(), 52);
        assert_eq!(unique_cards.len(), 52);
    }

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
        let mut deck = Deck::new();
        deck.shuffle(&mut StdRng::seed_from_u64(42));
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

    #[test]
    fn same_seed_produces_the_same_draw_sequence() {
        let mut first = Deck::new();
        let mut second = Deck::new();
        first.shuffle(&mut StdRng::seed_from_u64(42));
        second.shuffle(&mut StdRng::seed_from_u64(42));

        for _ in 0..52 {
            assert_eq!(first.draw(), second.draw());
        }
        assert!(first.draw().is_none());
        assert!(second.draw().is_none());
    }

    #[test]
    fn seeded_shuffle_changes_order_and_preserves_the_card_set() {
        let mut deck = Deck::new();
        let original_order = deck.cards.clone();
        let original_cards: HashSet<_> = original_order.iter().copied().collect();

        deck.shuffle(&mut StdRng::seed_from_u64(42));

        let shuffled_cards: HashSet<_> = deck.cards.iter().copied().collect();
        assert_eq!(deck.cards.len(), 52);
        assert_eq!(shuffled_cards, original_cards);
        assert_ne!(deck.cards, original_order);
    }
}
