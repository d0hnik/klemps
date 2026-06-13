import { Link } from "react-router-dom";
import "./logo.css";

function Logo() {
  return (
    <Link to="/" aria-label="Go to main menu" className="logo-link">
      <img
        className="game-logo"
        src="/images/klemps-logo.png"
        alt="KLEMPS"
        width={220}
        height={80}
      />
    </Link>
  );
}

export default Logo;
