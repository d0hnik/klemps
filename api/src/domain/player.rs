use crate::domain::{
    card::Card,
    ids::{GuestId, UserId},
};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PlayerIdentity {
    Guest(GuestId),
    User(UserId),
}

#[derive(PartialEq, Debug, Clone, Eq)]
pub struct GamePlayer {
    identity: PlayerIdentity,
    name: String,
    hand: Vec<Card>,
    drinks_given: u16,
    drinks_taken: u16,
}

impl GamePlayer {
    pub fn new(identity: PlayerIdentity, name: String) -> Self {
        GamePlayer {
            identity,
            name,
            hand: vec![],
            drinks_given: 0,
            drinks_taken: 0,
        }
    }

    pub fn set_hand(&mut self, hand: Vec<Card>) {
        self.hand = hand
    }
}
