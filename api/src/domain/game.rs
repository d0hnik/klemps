use uuid::Uuid;

use crate::domain::{
    card::Card, difficulty::Difficulty, game_state::GameState, player::GamePlayer,
    round_type::RoundType,
};

pub struct Game {
    id: Uuid,
    players: Vec<GamePlayer>,
    deck: Vec<Card>,
    difficulty: Difficulty,
    current_player_index: u8,
    current_round_type: RoundType,
    game_state: GameState,
}
