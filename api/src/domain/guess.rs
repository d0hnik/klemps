use crate::domain::{
    card::{Card, CardColor, Suit},
    error::GameError,
    round_type::RoundType,
};

#[derive(PartialEq, Debug, Clone, Copy, Eq)]
pub enum Guess {
    Color(CardColor),
    HigherLower(HigherLowerGuess),
    InsideOutside(InsideOutsideGuess),
    Suit(Suit),
}

#[derive(PartialEq, Debug, Clone, Copy, Eq)]
pub enum HigherLowerGuess {
    Higher,
    Lower,
}

#[derive(PartialEq, Debug, Clone, Copy, Eq)]
pub enum InsideOutsideGuess {
    Inside,
    Outside,
}

pub fn evaluate_guess(round: &RoundType, guess: Guess, hand: &[Card]) -> Result<bool, GameError> {
    let first_card = get_nth_card(0, hand)?;
    let second_card = get_nth_card(1, hand)?;
    let third_card = get_nth_card(2, hand)?;
    let fourth_card = get_nth_card(3, hand)?;

    match guess {
        Guess::Color(guess) => {
            if round != &RoundType::RedOrBlack {
                return Err(GameError::WrongGuessForRound);
            }
            Ok(guess_color(guess, first_card))
        }
        Guess::HigherLower(guess) => {
            if round != &RoundType::HigherLower {
                return Err(GameError::WrongGuessForRound);
            }
            Ok(guess_higher_lower(guess, first_card, second_card))
        }
        Guess::InsideOutside(guess) => {
            if round != &RoundType::InsideOutside {
                return Err(GameError::WrongGuessForRound);
            }
            Ok(guess_inside_outside(
                guess,
                first_card,
                second_card,
                third_card,
            ))
        }
        Guess::Suit(guess) => {
            if round != &RoundType::Suit {
                return Err(GameError::WrongGuessForRound);
            }
            Ok(guess_suit(guess, fourth_card))
        }
    }
}

fn get_nth_card(index: usize, player_deck: &[Card]) -> Result<&Card, GameError> {
    let optional_card = player_deck.get(index);
    if let Some(card) = optional_card {
        return Ok(card);
    }
    Err(GameError::MissingReferenceCards)
}

fn guess_color(guess: CardColor, card: &Card) -> bool {
    guess == card.suit().color()
}

fn guess_higher_lower(guess: HigherLowerGuess, previous_card: &Card, current_card: &Card) -> bool {
    match guess {
        HigherLowerGuess::Higher => previous_card.rank().value() < current_card.rank().value(),
        HigherLowerGuess::Lower => previous_card.rank().value() > current_card.rank().value(),
    }
}

fn guess_inside_outside(
    guess: InsideOutsideGuess,
    first_card: &Card,
    second_card: &Card,
    current_card: &Card,
) -> bool {
    let min_rank = first_card.rank().value().min(second_card.rank().value());
    let max_rank = first_card.rank().value().max(second_card.rank().value());

    let current_rank = current_card.rank().value();

    let is_inside = current_rank >= min_rank && current_rank <= max_rank;

    match guess {
        InsideOutsideGuess::Inside => is_inside,
        InsideOutsideGuess::Outside => !is_inside,
    }
}

fn guess_suit(guess: Suit, card: &Card) -> bool {
    guess == card.suit()
}

#[cfg(test)]
mod tests {
    use strum::IntoEnumIterator;

    use super::*;
    use crate::domain::card::{Rank, Suit};

    fn card(rank: Rank, suit: Suit) -> Card {
        Card::new(suit, rank)
    }

    fn hand() -> Vec<Card> {
        return vec![
            Card::new(Suit::Heart, Rank::Five),
            Card::new(Suit::Spade, Rank::Ten),
            Card::new(Suit::Diamond, Rank::Seven),
            Card::new(Suit::Club, Rank::Ace),
        ];
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
                guess_color(guess, &card),
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
                guess_higher_lower(HigherLowerGuess::Higher, &first, &second),
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
                guess_higher_lower(HigherLowerGuess::Lower, &first, &second),
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
            assert!(!guess_higher_lower(guess, &first, &second));
        }
    }

    #[test]
    fn ace_is_high() {
        let ace = card(Rank::Ace, Suit::Spade);
        let king = card(Rank::King, Suit::Heart);
        let two = card(Rank::Two, Suit::Diamond);

        assert!(guess_higher_lower(HigherLowerGuess::Higher, &king, &ace));
        assert!(guess_higher_lower(HigherLowerGuess::Lower, &ace, &king));
        assert!(guess_higher_lower(HigherLowerGuess::Higher, &two, &ace));

        assert!(!guess_higher_lower(HigherLowerGuess::Higher, &ace, &king));
        assert!(!guess_higher_lower(HigherLowerGuess::Lower, &king, &ace));
    }

    #[test]
    fn inside_outside_all_combinations() {
        let cases = [
            (Rank::Five, Rank::Ten, Rank::Seven, true, false),
            (Rank::Five, Rank::Ten, Rank::Two, false, true),
            (Rank::Five, Rank::Ten, Rank::King, false, true),
            (Rank::Five, Rank::Ten, Rank::Five, true, false),
            (Rank::Five, Rank::Ten, Rank::Ten, true, false),
            (Rank::Ten, Rank::Five, Rank::Seven, true, false),
            (Rank::Ten, Rank::Five, Rank::Two, false, true),
            (Rank::Seven, Rank::Seven, Rank::Seven, true, false),
            (Rank::Seven, Rank::Seven, Rank::Six, false, true),
            (Rank::Seven, Rank::Seven, Rank::Eight, false, true),
            (Rank::Two, Rank::Ace, Rank::King, true, false),
            (Rank::Two, Rank::Ace, Rank::Ace, true, false),
        ];

        for (first, second, current, expected_inside, expected_outside) in cases {
            let first_card = card(first, Suit::Club);
            let second_card = card(second, Suit::Club);
            let current_card = card(current, Suit::Club);

            for (guess, expected) in [
                (InsideOutsideGuess::Inside, expected_inside),
                (InsideOutsideGuess::Outside, expected_outside),
            ] {
                assert_eq!(
                    guess_inside_outside(guess, &first_card, &second_card, &current_card),
                    expected,
                    "Failed for {:?}, {:?}, {:?}, guess {:?}",
                    first,
                    second,
                    current,
                    guess
                );
            }
        }
    }

    #[test]
    fn suits_do_not_affect_result() {
        let suits = [Suit::Heart, Suit::Diamond, Suit::Club, Suit::Spade];

        for suit in suits {
            let first = Card::new(suit, Rank::Five);
            let second = Card::new(suit, Rank::Ten);
            let current = Card::new(suit, Rank::Seven);

            assert!(guess_inside_outside(
                InsideOutsideGuess::Inside,
                &first,
                &second,
                &current,
            ));

            assert!(!guess_inside_outside(
                InsideOutsideGuess::Outside,
                &first,
                &second,
                &current,
            ));
        }
    }

    #[test]
    fn guess_suit_all_combinations() {
        for card_suit in Suit::iter() {
            for guess in Suit::iter() {
                let card = Card::new(card_suit, Rank::Ace);
                let expected = guess == card_suit;

                assert_eq!(
                    guess_suit(guess, &card),
                    expected,
                    "Failed for card suit {:?} and guess {:?}",
                    card_suit,
                    guess
                );
            }
        }
    }

    #[test]
    fn evaluates_valid_guesses() {
        let hand = hand();

        let cases = [
            (RoundType::RedOrBlack, Guess::Color(CardColor::Red), true),
            (RoundType::RedOrBlack, Guess::Color(CardColor::Black), false),
            (
                RoundType::HigherLower,
                Guess::HigherLower(HigherLowerGuess::Higher),
                true,
            ),
            (
                RoundType::HigherLower,
                Guess::HigherLower(HigherLowerGuess::Lower),
                false,
            ),
            (
                RoundType::InsideOutside,
                Guess::InsideOutside(InsideOutsideGuess::Inside),
                true,
            ),
            (
                RoundType::InsideOutside,
                Guess::InsideOutside(InsideOutsideGuess::Outside),
                false,
            ),
            (RoundType::Suit, Guess::Suit(Suit::Club), true),
            (RoundType::Suit, Guess::Suit(Suit::Heart), false),
        ];

        for (round, guess, expected) in cases {
            let result = evaluate_guess(&round, guess, &hand);

            assert!(
                matches!(result, Ok(value) if value == expected),
                "Unexpected result for round {:?}: {:?}",
                round,
                result
            );
        }
    }

    #[test]
    fn rejects_wrong_guess_for_round() {
        let hand = hand();

        let rounds = [
            RoundType::RedOrBlack,
            RoundType::HigherLower,
            RoundType::InsideOutside,
            RoundType::Suit,
        ];

        for round in rounds {
            let guesses = [
                (RoundType::RedOrBlack, Guess::Color(CardColor::Red)),
                (
                    RoundType::HigherLower,
                    Guess::HigherLower(HigherLowerGuess::Higher),
                ),
                (
                    RoundType::InsideOutside,
                    Guess::InsideOutside(InsideOutsideGuess::Inside),
                ),
                (RoundType::Suit, Guess::Suit(Suit::Heart)),
            ];

            for (expected_round, guess) in guesses {
                if round == expected_round {
                    continue;
                }

                let result = evaluate_guess(&round, guess, &hand);

                assert!(
                    matches!(result, Err(GameError::WrongGuessForRound)),
                    "Expected WrongGuessForRound, got {:?}",
                    result
                );
            }
        }
    }

    #[test]
    fn returns_error_when_cards_are_missing() {
        let full_hand = hand();

        let cases = [
            (RoundType::RedOrBlack, Guess::Color(CardColor::Red), 0),
            (
                RoundType::HigherLower,
                Guess::HigherLower(HigherLowerGuess::Higher),
                1,
            ),
            (
                RoundType::InsideOutside,
                Guess::InsideOutside(InsideOutsideGuess::Inside),
                2,
            ),
            (RoundType::Suit, Guess::Suit(Suit::Club), 3),
        ];

        for (round, guess, available_cards) in cases {
            let partial_hand = &full_hand[..available_cards];

            let result = evaluate_guess(&round, guess, partial_hand);

            assert!(
                matches!(result, Err(GameError::MissingReferenceCards)),
                "Expected MissingReferenceCards, got {:?}",
                result
            );
        }
    }
}
