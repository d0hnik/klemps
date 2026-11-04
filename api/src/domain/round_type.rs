#[derive(PartialEq, Debug, Clone, Copy, Eq)]
pub enum RoundType {
    RedOrBlack,
    HigherLower,
    InsideOutside,
    Suit,
}

impl RoundType {
    pub fn get_next_round_type(&self) -> RoundType {
        match self {
            RoundType::RedOrBlack => RoundType::HigherLower,
            RoundType::HigherLower => RoundType::InsideOutside,
            RoundType::InsideOutside => RoundType::Suit,
            RoundType::Suit => RoundType::RedOrBlack,
        }
    }
}
