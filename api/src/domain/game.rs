use rand::Rng;

use crate::domain::{
    constants::{MAX_PLAYERS, MIN_PLAYERS},
    deck::Deck,
    difficulty::Difficulty,
    error::GameError,
    game_state::GameState,
    guess::{Guess, evaluate_guess},
    ids::GameId,
    player::{GamePlayer, PlayerIdentity},
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
    pub fn new(id: GameId, difficulty: Difficulty, rng: &mut impl Rng) -> Self {
        let mut deck = Deck::new();
        deck.shuffle(rng);

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

    pub fn get_players(&self) -> &[GamePlayer] {
        &self.players
    }

    pub fn get_current_player_index(&self) -> &usize {
        &self.current_player_index
    }

    pub fn get_current_round_type(&self) -> &RoundType {
        &self.current_round_type
    }

    pub fn deck(&self) -> &Deck {
        &self.deck
    }

    pub fn get_drinks_count(&self) -> u16 {
        self.difficulty
            .get_drinks_by_round_type(self.get_current_round_type())
    }

    pub fn get_current_player(&self) -> Result<&GamePlayer, GameError> {
        self.players
            .get(self.current_player_index)
            .ok_or(GameError::PlayerNotFound)
    }

    fn get_current_player_mut(&mut self) -> Result<&mut GamePlayer, GameError> {
        self.players
            .get_mut(self.current_player_index)
            .ok_or(GameError::PlayerNotFound)
    }

    fn deal_hands_to_players(&mut self) -> Result<(), GameError> {
        for player in self.players.iter_mut() {
            let hand = self.deck.draw_hand()?;
            player.set_hand(hand);
        }

        Ok(())
    }

    pub fn add_player(&mut self, player: GamePlayer) -> Result<(), GameError> {
        if self.game_state != GameState::Lobby {
            return Err(GameError::NotInLobby);
        }

        let already_joined = self
            .players
            .iter()
            .any(|existing| existing.identity() == player.identity());

        if already_joined {
            return Err(GameError::DuplicatePlayer);
        }

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

        if self.players.len() < MIN_PLAYERS || self.players.len() > MAX_PLAYERS {
            return Err(GameError::InvalidPlayerCount);
        }

        self.deal_hands_to_players()?;

        self.game_state = GameState::GameInProgress;

        Ok(())
    }

    pub fn make_a_guess(
        &mut self,
        identity: PlayerIdentity,
        guess: Guess,
    ) -> Result<bool, GameError> {
        if self.game_state != GameState::GameInProgress {
            return Err(GameError::InvalidGameStateToMakeAGuess);
        }

        let current_player = self.get_current_player()?;

        if current_player.identity() != identity {
            return Err(GameError::NotYourTurn);
        }

        let guess_result =
            evaluate_guess(self.get_current_round_type(), guess, current_player.hand())?;

        if !guess_result {
            let drinks_count = self.get_drinks_count();
            let mutable_player = self.get_current_player_mut()?;

            mutable_player.add_drinks_taken(drinks_count);
        } else {
            self.game_state = GameState::AwaitingDrinkAllocation;
        }

        Ok(guess_result)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::{SeedableRng, rngs::StdRng};
    use std::collections::HashSet;
    use uuid::Uuid;

    use crate::domain::{card::Card, ids::GuestId, player::PlayerIdentity};

    fn create_game() -> Game {
        let mut rng = StdRng::seed_from_u64(42);

        Game::new(
            GameId::from_uuid(Uuid::new_v4()),
            Difficulty::Easy,
            &mut rng,
        )
    }

    fn player(id: Uuid, name: &str) -> GamePlayer {
        GamePlayer::new(
            PlayerIdentity::Guest(GuestId::from_uuid(id)),
            name.to_string(),
        )
    }

    fn game_with_players(count: usize) -> Game {
        let mut game = create_game();

        for i in 0..count {
            game.add_player(player(Uuid::new_v4(), &format!("Player {i}")))
                .unwrap();
        }

        game
    }

    fn all_cards(game: &Game) -> Vec<Card> {
        game.players
            .iter()
            .flat_map(|player| player.hand().iter().copied())
            .collect()
    }

    #[test]
    fn games_with_two_to_seven_players_start() {
        for count in MIN_PLAYERS..=MAX_PLAYERS {
            let mut game = game_with_players(count);

            assert!(
                game.start().is_ok(),
                "Failed to start game with {count} players"
            );

            assert_eq!(game.game_state, GameState::GameInProgress);
            assert_eq!(game.players.len(), count);
        }
    }

    #[test]
    fn games_with_fewer_than_two_players_cannot_start() {
        for count in 0..MIN_PLAYERS {
            let mut game = game_with_players(count);

            assert!(matches!(game.start(), Err(GameError::InvalidPlayerCount)));

            assert_eq!(game.game_state, GameState::Lobby);
            assert_eq!(game.players.len(), count);
        }
    }

    #[test]
    fn duplicate_identities_are_rejected_even_with_different_names() {
        let mut game = create_game();

        let id = Uuid::new_v4();

        game.add_player(player(id, "Alice")).unwrap();

        let result = game.add_player(player(id, "Bob"));

        assert!(matches!(result, Err(GameError::DuplicatePlayer)));
        assert_eq!(game.players.len(), 1);
        assert_eq!(game.players[0].identity(), player(id, "Alice").identity());
    }

    #[test]
    fn eighth_player_is_rejected() {
        let mut game = game_with_players(MAX_PLAYERS);

        let result = game.add_player(player(Uuid::new_v4(), "Eighth Player"));

        assert!(matches!(result, Err(GameError::TooManyPlayers)));
        assert_eq!(game.players.len(), MAX_PLAYERS);
    }

    #[test]
    fn joining_after_start_and_starting_twice_are_rejected() {
        let mut game = game_with_players(MIN_PLAYERS);

        game.start().unwrap();

        assert!(matches!(
            game.add_player(player(Uuid::new_v4(), "Late Player")),
            Err(GameError::NotInLobby)
        ));

        assert!(matches!(
            game.start(),
            Err(GameError::InvalidGameStateToStartGame)
        ));

        assert_eq!(game.game_state, GameState::GameInProgress);
        assert_eq!(game.players.len(), MIN_PLAYERS);
    }

    #[test]
    fn startup_deals_four_unique_cards_per_player() {
        for count in MIN_PLAYERS..=MAX_PLAYERS {
            let mut game = game_with_players(count);

            game.start().unwrap();

            for player in &game.players {
                assert_eq!(
                    player.hand().len(),
                    4,
                    "Player must receive exactly 4 cards"
                );
            }

            let cards = all_cards(&game);
            let unique_cards: HashSet<_> = cards.iter().collect();

            assert_eq!(cards.len(), 4 * count);
            assert_eq!(
                unique_cards.len(),
                cards.len(),
                "Duplicate cards found across player hands"
            );
        }
    }

    #[test]
    fn remaining_deck_has_correct_card_count() {
        for count in MIN_PLAYERS..=MAX_PLAYERS {
            let mut game = game_with_players(count);

            game.start().unwrap();

            assert_eq!(
                game.deck().cards().len(),
                52 - 4 * count,
                "Incorrect remaining deck size for {count} players"
            );
        }
    }
}
