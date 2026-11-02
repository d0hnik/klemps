use strum::EnumIter;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Card {
    suit: Suit,
    rank: Rank,
}

impl Card {
    pub fn new(suit: Suit, rank: Rank) -> Self {
        Card { suit, rank }
    }

    pub fn rank(&self) -> Rank {
        self.rank
    }

    pub fn suit(&self) -> Suit {
        self.suit
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, EnumIter)]
pub enum Suit {
    Spade,
    Club,
    Heart,
    Diamond,
}

impl Suit {
    pub fn color(&self) -> CardColor {
        match self {
            Suit::Spade | Suit::Club => CardColor::Black,
            Suit::Diamond | Suit::Heart => CardColor::Red,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, EnumIter)]
#[repr(u8)]
pub enum Rank {
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    Ace = 14,
}

impl Rank {
    pub fn value(self) -> u8 {
        self as u8
    }
}

#[derive(PartialEq, Debug, Clone, Copy, Eq)]
pub enum CardColor {
    Red,
    Black,
}
