use crate::domain::card::{Card, CardColor};

#[derive(PartialEq, Debug, Clone, Copy, Eq)]
pub enum HigherLowerGuess {
    Higher,
    Lower,
}

pub fn guess_color(guess: CardColor, card: Card) -> bool {
    guess == card.suit().color()
}

pub fn guess_higher_lower(guess: HigherLowerGuess, first_card: Card, second_card: Card) -> bool {
    match guess {
        HigherLowerGuess::Higher => first_card.rank().value() < second_card.rank().value(),
        HigherLowerGuess::Lower => first_card.rank().value() > second_card.rank().value(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::card::{Rank, Suit};

    fn card(rank: Rank, suit: Suit) -> Card {
        Card::new(suit, rank)
    }

    #[test]
    fn guess_color_all_combinations() {
        let cases = [
            (Suit::Heart, CardColor::Red, true),
            (Suit::Heart, CardColor::Black, false),
            (Suit::Diamond, CardColor::Red, true),
            (Suit::Diamond, CardColor::Black, false),
            (Suit::Club, CardColor::Red, false),
            (Suit::Club, CardColor::Black, true),
            (Suit::Spade, CardColor::Red, false),
            (Suit::Spade, CardColor::Black, true),
        ];

        for (suit, guess, expected) in cases {
            let card = Card::new(suit, Rank::Ace);

            assert_eq!(
                guess_color(guess, card),
                expected,
                "Failed for suit {:?} and guess {:?}",
                suit,
                guess
            );
        }
    }

    #[test]
    fn higher_requires_strictly_greater_rank() {
        let first = card(Rank::Five, Suit::Heart);

        let cases = [
            (Rank::Six, true),
            (Rank::King, true),
            (Rank::Four, false),
            (Rank::Two, false),
        ];

        for (rank, expected) in cases {
            let second = card(rank, Suit::Spade);

            assert_eq!(
                guess_higher_lower(HigherLowerGuess::Higher, first, second),
                expected,
                "Higher guess failed for {:?} -> {:?}",
                first.rank(),
                second.rank()
            );
        }
    }

    #[test]
    fn lower_requires_strictly_smaller_rank() {
        let first = card(Rank::Ten, Suit::Heart);

        let cases = [
            (Rank::Nine, true),
            (Rank::Two, true),
            (Rank::Jack, false),
            (Rank::King, false),
        ];

        for (rank, expected) in cases {
            let second = card(rank, Suit::Spade);

            assert_eq!(
                guess_higher_lower(HigherLowerGuess::Lower, first, second),
                expected,
                "Lower guess failed for {:?} -> {:?}",
                first.rank(),
                second.rank()
            );
        }
    }

    #[test]
    fn equal_ranks_lose_for_higher_and_lower() {
        let first = card(Rank::Seven, Suit::Heart);
        let second = card(Rank::Seven, Suit::Club);

        for guess in [HigherLowerGuess::Higher, HigherLowerGuess::Lower] {
            assert!(!guess_higher_lower(guess, first, second));
        }
    }

    #[test]
    fn ace_is_high() {
        let ace = card(Rank::Ace, Suit::Spade);
        let king = card(Rank::King, Suit::Heart);
        let two = card(Rank::Two, Suit::Diamond);

        assert!(guess_higher_lower(HigherLowerGuess::Higher, king, ace));
        assert!(guess_higher_lower(HigherLowerGuess::Lower, ace, king));
        assert!(guess_higher_lower(HigherLowerGuess::Higher, two, ace));

        assert!(!guess_higher_lower(HigherLowerGuess::Higher, ace, king));
        assert!(!guess_higher_lower(HigherLowerGuess::Lower, king, ace));
    }
}
