import { useState } from "react";
import { DifficultyTab } from "../components/Difficulty/DifficultyTab";
import { PlayersTab } from "../components/Players/PlayersTab";
import type { DifficultyName } from "../entities/difficulty/difficulty";
import Logo from "../components/Logo/Logo";

function App() {
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const [playerCount, setPlayerCount] = useState<number>(2);

  const [difficultyName, setDifficultyName] = useState<DifficultyName>("EASY");

  return (
    <main className="game-setup">
      <div className="game-setup__header">
        <Logo />
      </div>
      <div className="game-setup__content">
        <PlayersTab
          onSetPlayerCount={setPlayerCount}
          playerCount={playerCount}
        />
        <DifficultyTab
          selectedDifficulty={difficultyName}
          onSelectDifficulty={setDifficultyName}
        />
      </div>
    </main>
  );
}

export default App;
