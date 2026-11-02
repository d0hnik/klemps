use crate::domain::{
    card::Card,
    ids::{GuestId, UserId},
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PlayerIdentity {
    Guest(GuestId),
    User(UserId),
}

pub struct GamePlayer {
    identity: PlayerIdentity,
    pub name: String,
    pub hand: Vec<Card>,
    pub drinks_given: u16,
    pub drinks_taken: u16,
}
