use crate::domain::card::Card;

#[derive(PartialEq, Debug, Clone)]
pub enum ColorGuess {
    Red,
    Black,
}

pub fn guess_color(guess: ColorGuess, card: Card) -> bool {
    guess == card.suit().color()
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::domain::card::{Rank, Suit};

    #[test]
    fn guess_color_all_combinations() {
        let cases = [
            (Suit::Heart, ColorGuess::Red, true),
            (Suit::Heart, ColorGuess::Black, false),
            (Suit::Diamond, ColorGuess::Red, true),
            (Suit::Diamond, ColorGuess::Black, false),
            (Suit::Club, ColorGuess::Red, false),
            (Suit::Club, ColorGuess::Black, true),
            (Suit::Spade, ColorGuess::Red, false),
            (Suit::Spade, ColorGuess::Black, true),
        ];

        for (suit, guess, expected) in cases {
            let card = Card::new(suit, Rank::Ace);

            assert_eq!(
                guess_color(guess.clone(), card),
                expected,
                "Failed for suit {:?} and guess {:?}",
                suit,
                guess
            );
        }
    }
}
