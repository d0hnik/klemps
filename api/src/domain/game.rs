use crate::domain::{
    deck::Deck, difficulty::Difficulty, game_state::GameState, ids::GameId, player::GamePlayer,
    round_type::RoundType,
};

pub struct Game {
    id: GameId,
    pub players: Vec<GamePlayer>,
    deck: Deck,
    difficulty: Difficulty,
    pub current_player_index: usize,
    current_round_type: RoundType,
    game_state: GameState,
}
