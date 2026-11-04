#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum GameError {
    MissingReferenceCards,
    WrongGuessForRound,
    TooManyPlayers,
    InvalidPlayerCount,
    NoMoreCards,
    InvalidGameStateToStartGame,
    InvalidGameStateToAssignDrinks,
    NotInLobby,
    DuplicatePlayer,
    PlayerNotFound,
    InvalidGameStateToMakeAGuess,
    NotYourTurn,
    DuplicateDrinkAllocation,
    InvalidAllocationTotal,
    CallerInDrinkAllocations,
    EmptyAllocations,
}
