import { Title } from "../random/Title";
import { PlayerRow } from "./PlayerRow";
import "./players.css";

export function PlayersTab() {
  return (
    <section className="players-tab">
      <div className="players-tab__title">
        <Title />
      </div>

      <div className="players-tab__rows">
        <PlayerRow />
        <PlayerRow />
        <PlayerRow />
        <PlayerRow />
      </div>

      <div className="players-tab__buttons">
        <button className="test-pixel-border">Press start 1p</button>
        <button>3</button>
        <button>4</button>
      </div>
    </section>
  );
}
