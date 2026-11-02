use crate::domain::{
    card::Card,
    ids::{GuestId, UserId},
};

#[derive()]
pub enum PlayerIdentity {
    Guest(GuestId),
    User(UserId),
}

pub struct GamePlayer {
    identity: PlayerIdentity,
    name: String,
    hand: Vec<Card>,
    drinks_given: u16,
    drinks_taken: u16,
}
