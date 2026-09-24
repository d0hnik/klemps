import { useNavigate } from "react-router-dom";
import { MainButton } from "../components/Buttons/MainButton";

export function MainMenuView() {
  const navigate = useNavigate();

  return (
    <>
      <div className="main-menu__buttons">
        <MainButton
          text="START"
          active={false}
          onClick={() => navigate("/setup")}
        />
      </div>
    </>
  );
}
