use crate::domain::{
    card::Card, difficulty::Difficulty, game_state::GameState, ids::GameId, player::GamePlayer,
    round_type::RoundType,
};

pub struct Game {
    id: GameId,
    players: Vec<GamePlayer>,
    deck: Vec<Card>,
    difficulty: Difficulty,
    current_player_index: u8,
    current_round_type: RoundType,
    game_state: GameState,
}
