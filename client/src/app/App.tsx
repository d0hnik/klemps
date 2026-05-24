import { useState } from "react";
import { DifficultyTab } from "../components/Difficulty/DifficultyTab";
import { PlayersTab } from "../components/Players/PlayersTab";
import type { DifficultyName } from "../entities/difficulty/difficulty";
import Logo from "../components/Logo/logo";

function App() {
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const [playerCount, setPlayerCount] = useState<number>(2);

  const [difficultyName, setDifficultyName] = useState<DifficultyName>("EASY");

  return (
    <main className="game-setup">
      <div className="left-container">
        <Logo />
        <PlayersTab
          onSetPlayerCount={setPlayerCount}
          playerCount={playerCount}
        />
      </div>
      <DifficultyTab
        selectedDifficulty={difficultyName}
        onSelectDifficulty={setDifficultyName}
      />
    </main>
  );
}

export default App;
