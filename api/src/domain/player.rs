use uuid::Uuid;

use crate::domain::card::Card;

pub struct Player {
    id: Uuid,
    name: String,
    drinksGiven: u8,
    drinksTaken: u8,
    avatarSrc: String,
    hand: Vec<Card>,
}
