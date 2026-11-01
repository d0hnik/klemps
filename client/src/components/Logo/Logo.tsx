import { Link } from "react-router-dom";
import "./logo.css";

function Logo() {
  return (
    <Link
      to="/"
      aria-label="Go to main menu"
      className="inline-flex min-w-0 items-center justify-center"
    >
      <img
        className="h-auto w-[300px] sm:w-[300px] md:w-[360px]"
        src="/images/klemps-logo.png"
        alt="KLEMPS"
        width={2693}
        height={584}
      />
    </Link>
  );
}

export default Logo;
