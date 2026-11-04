use crate::domain::player::PlayerIdentity;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DrinkAllocation {
    pub recipient: PlayerIdentity,
    pub amount: u16,
}
