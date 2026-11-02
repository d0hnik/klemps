#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Difficulty {
    Easy,
    Hard,
}

impl Difficulty {
    pub fn drinks_per_round(self) -> [u8; 4] {
        match self {
            Self::Easy => [1, 2, 3, 4],
            Self::Hard => [2, 4, 6, 8],
        }
    }
}
