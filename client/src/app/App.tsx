import { Navigate, Route, Routes } from "react-router-dom";
import { MainMenuView } from "../views/MainMenu";
import { GameSetupView } from "../views/GameSetup";
import { GameView } from "../views/GamePage";
import { Footer } from "./AppLayout/Footer";
import { Header } from "./AppLayout/Header";

export function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<MainMenuView />} />
          <Route path="/setup" element={<GameSetupView />} />
          <Route path="/game" element={<GameView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
