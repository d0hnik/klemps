use crate::domain::{
    deck::Deck, difficulty::Difficulty, game_state::GameState, ids::GameId, player::GamePlayer,
    round_type::RoundType,
};

pub struct Game {
    id: GameId,
    players: Vec<GamePlayer>,
    deck: Deck,
    difficulty: Difficulty,
    current_player_index: usize,
    current_round_type: RoundType,
    game_state: GameState,
}

impl Game {
    pub fn get_players(&self) -> &[GamePlayer] {
        &self.players
    }

    pub fn get_current_player_index(&self) -> &usize {
        &self.current_player_index
    }

    pub fn get_current_round_type(&self) -> &RoundType {
        &self.current_round_type
    }
}
