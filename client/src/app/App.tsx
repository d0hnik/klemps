import { useState } from "react";
import { DifficultyTab } from "../components/Difficulty/DifficultyTab";
import { PlayersTab } from "../components/Players/PlayersTab";
import type { DifficultyName } from "../entities/difficulty/difficulty";
import Logo from "../components/Logo/Logo";
import { MainButton } from "../components/Buttons/MainButton";
import { createGame, type GameState } from "../entities/gameState";
import { GamePage } from "../components/GamePage/GamePage";

function App() {
  const [playerNames, setPlayerNames] = useState<string[]>(() =>
    Array.from({ length: 2 }, () => ""),
  );

  const [playerCount, setPlayerCount] = useState<number>(2);

  const [difficultyName, setDifficultyName] = useState<DifficultyName>("EASY");

  const [gameState, setGameState] = useState<GameState | null>(null);

  function handleSetPlayerCount(count: number) {
    setPlayerCount(count);

    setPlayerNames((currentNames) =>
      Array.from({ length: count }, (_, index) => currentNames[index] ?? ""),
    );
  }

  function handleSetPlayerName(playerIndex: number, name: string) {
    const arrayIndex = playerIndex - 1;

    setPlayerNames((currentNames) => {
      const nextNames = [...currentNames];
      nextNames[arrayIndex] = name;
      return nextNames;
    });
  }

  function handleStartGame(
    playerNames: string[],
    difficultyName: DifficultyName,
  ) {
    const normalizePlayerNames = playerNames.map((name, index) => {
      const trimmedName = name.trim();

      if (trimmedName != "") {
        return name;
      }

      return `Player ${index + 1}`;
    });

    setGameState(createGame(normalizePlayerNames, difficultyName));
  }

  if (gameState !== null) {
    return <GamePage gameState={gameState} />;
  }

  return (
    <main className="game-setup">
      <div className="game-setup__header">
        <Logo />
      </div>
      <div className="game-setup__content">
        <PlayersTab
          playerCount={playerCount}
          onSetPlayerCount={handleSetPlayerCount}
          onSetPlayerName={handleSetPlayerName}
          playerNames={playerNames}
        />
        <DifficultyTab
          selectedDifficulty={difficultyName}
          onSelectDifficulty={setDifficultyName}
        />
      </div>
      <div className="game-setup__buttons">
        <MainButton
          text={"TEST"}
          onClick={() => handleStartGame(playerNames, difficultyName)}
          active={false}
        />
      </div>
    </main>
  );
}

export default App;
