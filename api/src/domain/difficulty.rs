use crate::domain::round_type::RoundType;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Difficulty {
    Easy,
    Hard,
}

impl Difficulty {
    pub fn drinks_per_round(self) -> [u16; 4] {
        match self {
            Self::Easy => [1, 2, 3, 4],
            Self::Hard => [2, 4, 6, 8],
        }
    }

    pub fn get_drinks_by_round_type(self, round_type: &RoundType) -> u16 {
        let drinks = self.drinks_per_round();

        match round_type {
            RoundType::RedOrBlack => drinks[0],
            RoundType::HigherLower => drinks[1],
            RoundType::InsideOutside => drinks[2],
            RoundType::Suit => drinks[3],
        }
    }
}
