use crate::domain::{
    deck::Deck, difficulty::Difficulty, game_state::GameState, ids::GameId, player::GamePlayer,
    round_type::RoundType,
};

pub struct Game {
    id: GameId,
    players: Vec<GamePlayer>,
    deck: Deck,
    difficulty: Difficulty,
    current_player_index: u8,
    current_round_type: RoundType,
    game_state: GameState,
}
