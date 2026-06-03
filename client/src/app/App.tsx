import { useState } from "react";
import { DifficultyTab } from "../components/Difficulty/DifficultyTab";
import { PlayersTab } from "../components/Players/PlayersTab";
import type { DifficultyName } from "../entities/difficulty/difficulty";
import Logo from "../components/Logo/Logo";
import { createGame, type GameState } from "../entities/gameState";
import { GamePage } from "../components/GamePage/GamePage";
import { BackButton } from "../components/Buttons/backButton/BackButton";
import { StartButton } from "../components/Buttons/startButton/startButton";

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
    <main className="flex flex-col">
      <div className="flex justify-start mb-10">
        <Logo />
      </div>
      <div className="flex flex-row justify-evenly">
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
      <div className="flex flex-row justify-between mt-10">
        <BackButton
          onClick={function (): void {
            throw new Error("Function not implemented.");
          }}
          iconSize={40}
          additionalStyle={"ml-16"}
        />
        <StartButton
          onClick={() => handleStartGame(playerNames, difficultyName)}
        />
      </div>
    </main>
  );
}

export default App;
