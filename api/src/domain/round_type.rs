#[derive(PartialEq, Debug, Clone, Copy, Eq)]
pub enum RoundType {
    RedOrBlack,
    HigherLower,
    InsideOutside,
    Suit,
}
