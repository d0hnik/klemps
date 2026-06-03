import { useNavigate } from "react-router-dom";
import "./logo.css";
import { clearGameState } from "../../entities/gameStorage";

function Logo() {
  const navigate = useNavigate();

  function clearGameStateAndRedirectHome() {
    clearGameState();
    navigate("/");
  }
  return (
    <button type="button" onClick={clearGameStateAndRedirectHome}>
      {" "}
      <img
        className="game-logo"
        src="/images/klemps-logo.png"
        alt="KLEMPS logo"
      />
    </button>
  );
}

export default Logo;
