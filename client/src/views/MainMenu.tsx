// TODO: At some point will make the UI better

import { useNavigate } from "react-router-dom";
import { MainButton } from "../components/Buttons/MainButton";
import Logo from "../components/Logo/Logo";

export function MainMenuView() {
  const navigate = useNavigate();

  return (
    <main className="main-menu">
      <Logo />

      <div className="main-menu__buttons">
        <MainButton
          text="START"
          active={false}
          onClick={() => navigate("/setup")}
        />
      </div>
    </main>
  );
}
