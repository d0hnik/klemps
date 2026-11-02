#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum GameError {
    MissingReferenceCards,
    WrongGuessForRound,
    TooManyPlayers,
    InvalidPlayerCount,
    NoMoreCards,
    InvalidGameStateToStartGame,
}
