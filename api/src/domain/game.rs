use uuid::Uuid;

use crate::domain::{
    card::Card, difficulty::Difficulty, game_state::GameState, player::Player,
    round_type::RoundType,
};

pub struct Game {
    id: Uuid,
    players: Vec<Player>,
    deck: Vec<Card>,
    difficulty: Difficulty,
    currentPlayerIndex: u8,
    currentRoundType: RoundType,
    gameState: GameState,
}
