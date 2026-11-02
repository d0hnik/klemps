#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum GameState {
    Lobby,
    GameInProgress,
    AwaitingDrinkAllocation,
    Finished,
}
