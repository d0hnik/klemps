import { Navigate, Route, Routes } from "react-router-dom";
import { MainMenuView } from "../views/MainMenu";
import { GameSetupView } from "../views/GameSetup";
import { GameView } from "../views/GamePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainMenuView />} />
      <Route path="/setup" element={<GameSetupView />} />
      <Route path="/game" element={<GameView />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
