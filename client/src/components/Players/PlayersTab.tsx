import { MainButton } from "../Buttons/MainButton";
import { Title } from "../Title/Title";
import { PlayerRow } from "./PlayerRow";
import "./players.css";

export function PlayersTab() {
  return (
    <section className="players-tab">
      <Title index={"1"} title={"PLAYERS"} />

      <div className="players-tab__rows">
        <PlayerRow />
        <PlayerRow />
        <PlayerRow />
        <PlayerRow />
      </div>

      <span className="players-select-text">SELECT PLAYERS: </span>

      <div className="players-tab__buttons">
        <MainButton text={"2"} />
        <MainButton text={"3"} />
        <MainButton text={"4"} />
        <MainButton text={"5"} />
        <MainButton text={"6"} />
        <MainButton text={"7"} />
      </div>
    </section>
  );
}
