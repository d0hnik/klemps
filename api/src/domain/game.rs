use rand::Rng;

use crate::domain::{
    deck::Deck,
    difficulty::Difficulty,
    drink_allocation::DrinkAllocation,
    error::GameError,
    game_state::GameState,
    guess::{Guess, evaluate_guess},
    ids::GameId,
    player::{GamePlayer, PlayerIdentity},
    round_type::RoundType,
    validation::{
        validate_adding_player_to_game, validate_assign_drinks, validate_make_guess,
        validate_start_game,
    },
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

    pub fn get_id(&self) -> &GameId {
        &self.id
    }

    pub fn get_players(&self) -> &[GamePlayer] {
        &self.players
    }

    pub fn get_players_identities(&self) -> Vec<&PlayerIdentity> {
        self.get_players().iter().map(|p| p.identity()).collect()
    }

    pub fn get_current_player_index(&self) -> &usize {
        &self.current_player_index
    }

    pub fn get_current_round_type(&self) -> &RoundType {
        &self.current_round_type
    }

    pub fn get_game_state(&self) -> &GameState {
        &self.game_state
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

    fn get_player_mut(&mut self, identity: &PlayerIdentity) -> Result<&mut GamePlayer, GameError> {
        self.players
            .iter_mut()
            .find(|player| player.identity() == identity)
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
        validate_adding_player_to_game(self, &player)?;

        self.players.push(player);

        Ok(())
    }

    pub fn start(&mut self) -> Result<(), GameError> {
        validate_start_game(self)?;

        self.deal_hands_to_players()?;

        self.game_state = GameState::GameInProgress;

        Ok(())
    }

    pub fn make_a_guess(
        &mut self,
        identity: &PlayerIdentity,
        guess: Guess,
    ) -> Result<bool, GameError> {
        validate_make_guess(self, identity)?;

        let guess_result = evaluate_guess(
            self.get_current_round_type(),
            guess,
            self.get_current_player()?.hand(),
        )?;

        if !guess_result {
            let drinks_count = self.get_drinks_count();
            let mutable_player = self.get_current_player_mut()?;

            mutable_player.add_drinks_taken(drinks_count);

            self.advance_turn();
        } else {
            self.game_state = GameState::AwaitingDrinkAllocation;
        }

        Ok(guess_result)
    }

    fn advance_turn(&mut self) {
        let current_player_index = self.get_current_player_index();

        let players_len = self.get_players().len();

        if *current_player_index == players_len - 1 {
            if self.get_current_round_type() == &RoundType::Suit {
                self.game_state = GameState::Finished;
                return;
            }

            self.current_player_index = 0;

            let next_round_type = self.get_current_round_type().get_next_round_type();

            self.current_round_type = next_round_type;
        } else {
            self.current_player_index += 1;
        }
    }

    pub fn assign_drinks(
        &mut self,
        actor: PlayerIdentity,
        allocations: &[DrinkAllocation],
    ) -> Result<(), GameError> {
        let total = validate_assign_drinks(self, &actor, allocations)?;

        let mutable_current_player = self.get_current_player_mut()?;

        mutable_current_player.add_drinks_given(total);

        for allocation in allocations {
            let player_mut = self.get_player_mut(&allocation.recipient)?;

            player_mut.add_drinks_taken(allocation.amount);
        }

        self.game_state = GameState::GameInProgress;

        self.advance_turn();

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::{SeedableRng, rngs::StdRng};
    use std::collections::HashSet;
    use uuid::Uuid;

    use crate::domain::{
        card::{Card, CardColor},
        constants::{MAX_PLAYERS, MIN_PLAYERS},
        ids::GuestId,
        player::PlayerIdentity,
    };

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

    fn wrong_color_guess(game: &Game) -> Guess {
        let player = game.get_current_player().unwrap();
        let card = player.hand()[0];

        let guess = match card.suit().color() {
            CardColor::Red => CardColor::Black,
            CardColor::Black => CardColor::Red,
        };

        Guess::Color(guess)
    }

    fn ready_for_allocation(player_count: usize, round: RoundType) -> Game {
        let mut game = game_with_players(player_count);
        game.start().unwrap();

        game.current_round_type = round;
        game.game_state = GameState::AwaitingDrinkAllocation;

        game
    }

    fn allocation(game: &Game, player_index: usize, amount: u16) -> DrinkAllocation {
        DrinkAllocation {
            recipient: *game.players[player_index].identity(),
            amount,
        }
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

    #[test]
    fn wrong_guess_advances_to_next_player() {
        let mut game = game_with_players(3);
        game.start().unwrap();

        let identity = *game.get_current_player().unwrap().identity();
        let guess = wrong_color_guess(&game);

        let result = game.make_a_guess(&identity, guess);

        assert!(matches!(result, Ok(false)));
        assert_eq!(game.current_player_index, 1);
        assert_eq!(game.current_round_type, RoundType::RedOrBlack);
        assert_eq!(game.game_state, GameState::GameInProgress);
    }

    #[test]
    fn last_player_advances_to_next_round() {
        let mut game = game_with_players(3);
        game.start().unwrap();

        game.current_player_index = 2;

        let identity = *game.get_current_player().unwrap().identity();
        let guess = wrong_color_guess(&game);

        let result = game.make_a_guess(&identity, guess);

        assert!(matches!(result, Ok(false)));
        assert_eq!(game.current_player_index, 0);
        assert_eq!(game.current_round_type, RoundType::HigherLower);
        assert_eq!(game.game_state, GameState::GameInProgress);
    }

    #[test]
    fn advance_turn_transitions_through_all_rounds() {
        let mut game = game_with_players(2);
        game.start().unwrap();

        let transitions = [
            (RoundType::RedOrBlack, RoundType::HigherLower),
            (RoundType::HigherLower, RoundType::InsideOutside),
            (RoundType::InsideOutside, RoundType::Suit),
        ];

        for (current_round, next_round) in transitions {
            game.current_round_type = current_round;
            game.current_player_index = 1;

            game.advance_turn();

            assert_eq!(game.current_player_index, 0);
            assert_eq!(game.current_round_type, next_round);
            assert_eq!(game.game_state, GameState::GameInProgress);
        }
    }

    #[test]
    fn final_turn_finishes_game() {
        let mut game = game_with_players(2);
        game.start().unwrap();

        game.current_round_type = RoundType::Suit;
        game.current_player_index = 1;

        game.advance_turn();

        assert_eq!(game.game_state, GameState::Finished);
        assert_eq!(game.current_round_type, RoundType::Suit);
        assert_eq!(game.current_player_index, 1);
    }

    #[test]
    fn previous_player_cannot_guess_again() {
        let mut game = game_with_players(2);
        game.start().unwrap();

        let previous_identity = *game.get_current_player().unwrap().identity();
        let guess = wrong_color_guess(&game);

        assert!(matches!(
            game.make_a_guess(&previous_identity, guess),
            Ok(false)
        ));

        assert_eq!(game.current_player_index, 1);

        let drinks_before = game.players[0].drinks_taken();

        let result = game.make_a_guess(&previous_identity, Guess::Color(CardColor::Red));

        assert!(matches!(result, Err(GameError::NotYourTurn)));

        assert_eq!(game.current_player_index, 1);
        assert_eq!(game.current_round_type, RoundType::RedOrBlack);
        assert_eq!(game.game_state, GameState::GameInProgress);
        assert_eq!(game.players[0].drinks_taken(), drinks_before);
    }

    #[test]
    fn assigning_full_budget_to_one_recipient() {
        let mut game = ready_for_allocation(3, RoundType::Suit);

        let actor = *game.players[0].identity();
        let allocations = [allocation(&game, 1, 4)];

        assert!(game.assign_drinks(actor, &allocations).is_ok());

        assert_eq!(game.players[0].drinks_given(), 4);
        assert_eq!(game.players[1].drinks_taken(), 4);
        assert_eq!(game.players[2].drinks_taken(), 0);

        assert_eq!(game.game_state, GameState::GameInProgress);
        assert_eq!(game.current_player_index, 1);
    }

    #[test]
    fn splitting_budget_between_recipients() {
        let mut game = ready_for_allocation(3, RoundType::Suit);

        let actor = *game.players[0].identity();

        let allocations = [allocation(&game, 1, 1), allocation(&game, 2, 3)];

        assert!(game.assign_drinks(actor, &allocations).is_ok());

        assert_eq!(game.players[0].drinks_given(), 4);
        assert_eq!(game.players[1].drinks_taken(), 1);
        assert_eq!(game.players[2].drinks_taken(), 3);

        assert_eq!(game.current_player_index, 1);
    }

    #[test]
    fn rejects_wrong_phase_and_actor() {
        let mut game = game_with_players(3);
        game.start().unwrap();

        let actor = *game.players[0].identity();
        let wrong_actor = *game.players[1].identity();

        let allocations = [allocation(&game, 1, 1)];

        assert!(matches!(
            game.assign_drinks(actor, &allocations),
            Err(GameError::InvalidGameStateToAssignDrinks)
        ));

        game.game_state = GameState::AwaitingDrinkAllocation;

        assert!(matches!(
            game.assign_drinks(wrong_actor, &allocations),
            Err(GameError::NotYourTurn)
        ));
    }

    #[test]
    fn rejects_unknown_recipients_and_duplicates() {
        let mut game = ready_for_allocation(3, RoundType::Suit);

        let actor = *game.players[0].identity();

        let unknown_identity = *player(Uuid::new_v4(), "Unknown").identity();

        let unknown_allocations = [DrinkAllocation {
            recipient: unknown_identity,
            amount: 4,
        }];

        assert!(matches!(
            game.assign_drinks(actor, &unknown_allocations),
            Err(GameError::PlayerNotFound)
        ));

        let duplicate_allocations = [allocation(&game, 1, 2), allocation(&game, 1, 2)];

        assert!(matches!(
            game.assign_drinks(actor, &duplicate_allocations),
            Err(GameError::DuplicateDrinkAllocation)
        ));
    }

    #[test]
    fn rejects_invalid_allocation_totals() {
        let mut game = ready_for_allocation(3, RoundType::Suit);

        let actor = *game.players[0].identity();

        let cases = [
            (vec![allocation(&game, 1, 3)], "below budget"),
            (vec![allocation(&game, 1, 5)], "above budget"),
            (vec![], "empty allocations"),
            (
                vec![allocation(&game, 1, u16::MAX), allocation(&game, 2, 1)],
                "overflow",
            ),
        ];

        for (allocations, description) in cases {
            let result = game.assign_drinks(actor, &allocations);

            assert!(
                matches!(result, Err(GameError::InvalidAllocationTotal)),
                "Failed case: {description}, got {result:?}"
            );
        }
    }

    #[test]
    fn rejected_allocations_preserve_game_state() {
        let mut game = ready_for_allocation(3, RoundType::Suit);

        let actor = *game.players[0].identity();

        let original_given: Vec<_> = game.players.iter().map(|p| p.drinks_given()).collect();

        let original_taken: Vec<_> = game.players.iter().map(|p| p.drinks_taken()).collect();

        let original_index = game.current_player_index;
        let original_round = game.current_round_type;
        let original_state = game.game_state;

        let invalid_cases = [
            vec![allocation(&game, 1, 3)],
            vec![allocation(&game, 1, 5)],
            vec![allocation(&game, 1, 2), allocation(&game, 1, 2)],
            vec![allocation(&game, 1, u16::MAX), allocation(&game, 2, 1)],
        ];

        for allocations in invalid_cases {
            assert!(game.assign_drinks(actor, &allocations).is_err());

            let current_given: Vec<_> = game.players.iter().map(|p| p.drinks_given()).collect();

            let current_taken: Vec<_> = game.players.iter().map(|p| p.drinks_taken()).collect();

            assert_eq!(current_given, original_given);
            assert_eq!(current_taken, original_taken);

            assert_eq!(game.current_player_index, original_index);
            assert_eq!(game.current_round_type, original_round);
            assert_eq!(game.game_state, original_state);
        }
    }

    #[test]
    fn repeated_submission_is_rejected() {
        let mut game = ready_for_allocation(3, RoundType::Suit);

        let actor = *game.players[0].identity();
        let allocations = [allocation(&game, 1, 4)];

        game.assign_drinks(actor, &allocations).unwrap();

        let result = game.assign_drinks(actor, &allocations);

        assert!(matches!(
            result,
            Err(GameError::InvalidGameStateToAssignDrinks)
        ));

        assert_eq!(game.players[0].drinks_given(), 4);
        assert_eq!(game.players[1].drinks_taken(), 4);
        assert_eq!(game.current_player_index, 1);
        assert_eq!(game.game_state, GameState::GameInProgress);
    }

    #[test]
    fn final_turn_allocation_finishes_game() {
        let mut game = ready_for_allocation(3, RoundType::Suit);

        game.current_player_index = game.players.len() - 1;

        let actor = *game.players[2].identity();
        let allocations = [allocation(&game, 0, 4)];

        assert!(game.assign_drinks(actor, &allocations).is_ok());

        assert_eq!(game.players[2].drinks_given(), 4);
        assert_eq!(game.players[0].drinks_taken(), 4);

        assert_eq!(game.game_state, GameState::Finished);
        assert_eq!(game.current_round_type, RoundType::Suit);
        assert_eq!(game.current_player_index, 2);
    }
}
