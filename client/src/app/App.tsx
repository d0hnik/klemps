import { DifficultyTab } from "../components/Difficulty/DifficultyTab";
import { PlayersTab } from "../components/Players/PlayersTab";

function App() {
  return (
    <main className="game-setup">
      <PlayersTab />
      <DifficultyTab />
    </main>
  );
}

export default App;
