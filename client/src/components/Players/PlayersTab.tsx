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

      <span className="players-select-text">SELECT PLAYERS: </span>

      <div className="players-tab__buttons">
        <button
          className="secondary-pixel-corners players-tab__player-count-button"
          type="button"
        >
          2
        </button>
        <button
          className="secondary-pixel-corners players-tab__player-count-button"
          type="button"
        >
          3
        </button>
        <button
          className="secondary-pixel-corners players-tab__player-count-button"
          type="button"
        >
          4
        </button>
        <button
          className="secondary-pixel-corners players-tab__player-count-button"
          type="button"
        >
          5
        </button>
        <button
          className="secondary-pixel-corners players-tab__player-count-button"
          type="button"
        >
          6
        </button>
        <button
          className="secondary-pixel-corners players-tab__player-count-button"
          type="button"
        >
          7
        </button>
      </div>
    </section>
  );
}
