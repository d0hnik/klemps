use rand::Rng;

use crate::domain::{
    constants::MAX_PLAYERS, deck::Deck, difficulty::Difficulty, error::GameError,
    game_state::GameState, ids::GameId, player::GamePlayer, round_type::RoundType,
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
    pub fn new(id: GameId, difficulty: Difficulty, rng: Option<&mut impl Rng>) -> Self {
        let deck = if let Some(rng) = rng {
            let mut deck = Deck::new();
            deck.shuffle(rng);
            deck
        } else {
            Deck::new_shuffled()
        };

        Game {
            id,
            players: vec![],
            deck,
            difficulty,
            current_player_index: 0,
            current_round_type: RoundType::RedOrBlack,
            game_state: GameState::Lobby,
        }
    }

    pub fn add_player(&mut self, player: GamePlayer) -> Result<(), GameError> {
        if self.players.len() >= MAX_PLAYERS {
            return Err(GameError::TooManyPlayers);
        }

        self.players.push(player);
        Ok(())
    }

    pub fn start(&mut self) -> Result<(), GameError> {
        if self.game_state != GameState::Lobby {
            return Err(GameError::InvalidGameStateToStartGame);
        }

        if self.players.len() < 2 || self.players.len() > 7 {
            return Err(GameError::InvalidPlayerCount);
        }

        self.deal_hands_to_players()?;

        self.game_state = GameState::GameInProgress;

        Ok(())
    }

    fn deal_hands_to_players(&mut self) -> Result<(), GameError> {
        for player in self.players.iter_mut() {
            let hand = self.deck.draw_hand()?;
            player.set_hand(hand);
        }

        Ok(())
    }

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
