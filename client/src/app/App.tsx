import { useState } from "react";
import { DifficultyTab } from "../components/Difficulty/DifficultyTab";
import { PlayersTab } from "../components/Players/PlayersTab";
import type { DifficultyName } from "../entities/difficulty/difficulty";

function App() {
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const [playerCount, setPlayerCount] = useState<number>(2);

  const [difficultyName, setDifficultyName] = useState<DifficultyName>("EASY");

  return (
    <main className="game-setup">
      <PlayersTab onSetPlayerCount={setPlayerCount} playerCount={playerCount} />
      <DifficultyTab
        selectedDifficulty={difficultyName}
        onSelectDifficulty={setDifficultyName}
      />
    </main>
  );
}

export default App;
