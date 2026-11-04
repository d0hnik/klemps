use std::collections::HashSet;

use crate::domain::{
    constants::{MAX_PLAYERS, MIN_PLAYERS},
    drink_allocation::DrinkAllocation,
    error::GameError,
    game::Game,
    game_state::GameState,
    player::{GamePlayer, PlayerIdentity},
};

pub fn validate_adding_player_to_game(game: &Game, player: &GamePlayer) -> Result<(), GameError> {
    if game.get_game_state() != &GameState::Lobby {
        return Err(GameError::NotInLobby);
    }

    let already_joined = game
        .get_players()
        .iter()
        .any(|existing| existing.identity() == player.identity());

    if already_joined {
        return Err(GameError::DuplicatePlayer);
    }

    if game.get_players().len() >= MAX_PLAYERS {
        return Err(GameError::TooManyPlayers);
    }

    Ok(())
}

pub fn validate_start_game(game: &Game) -> Result<(), GameError> {
    if game.get_game_state() != &GameState::Lobby {
        return Err(GameError::InvalidGameStateToStartGame);
    }

    if game.get_players().len() < MIN_PLAYERS || game.get_players().len() > MAX_PLAYERS {
        return Err(GameError::InvalidPlayerCount);
    }

    Ok(())
}

pub fn validate_make_guess(game: &Game, caller: &PlayerIdentity) -> Result<(), GameError> {
    if game.get_game_state() != &GameState::GameInProgress {
        return Err(GameError::InvalidGameStateToMakeAGuess);
    }

    let current_player = game.get_current_player()?;

    if current_player.identity() != caller {
        return Err(GameError::NotYourTurn);
    }

    Ok(())
}

pub fn validate_assign_drinks(
    game: &Game,
    caller: &PlayerIdentity,
    allocations: &[DrinkAllocation],
) -> Result<u16, GameError> {
    if allocations.is_empty() {
        return Err(GameError::EmptyAllocations);
    }

    if game.get_game_state() != &GameState::AwaitingDrinkAllocation {
        return Err(GameError::InvalidGameStateToAssignDrinks);
    }

    let current_player = game.get_current_player()?;

    if current_player.identity() != caller {
        return Err(GameError::NotYourTurn);
    }

    let caller_in_allocations = allocations
        .iter()
        .all(|allocation| &allocation.recipient == caller);

    if caller_in_allocations {
        return Err(GameError::CallerInDrinkAllocations);
    }

    let all_players_exist = allocations.iter().all(|allocation| {
        game.get_players()
            .iter()
            .any(|player| player.identity() == &allocation.recipient)
    });

    if !all_players_exist {
        return Err(GameError::PlayerNotFound);
    }

    let mut seen = HashSet::new();

    let has_duplicates = allocations
        .iter()
        .any(|allocation| !seen.insert(allocation.recipient));

    if has_duplicates {
        return Err(GameError::DuplicateDrinkAllocation);
    }

    let mut total = 0u16;

    for allocation in allocations {
        total = total
            .checked_add(allocation.amount)
            .ok_or(GameError::InvalidAllocationTotal)?;
    }

    if total != game.get_drinks_count() {
        return Err(GameError::InvalidAllocationTotal);
    }

    Ok(total)
}
