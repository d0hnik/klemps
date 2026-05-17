import { MainButton } from "../Buttons/MainButton";
import { Title } from "../Title/Title";
import { PlayerRow } from "./PlayerRow";
import "./players.css";

type Props = {
  onSetPlayerCount: (count: number) => void;
  playerCount: number;
};

export function PlayersTab({ onSetPlayerCount, playerCount }: Props) {
  return (
    <section className="players-tab">
      <Title index={"1"} title={"PLAYERS"} />

      <div className="players-tab__rows">
        {Array.from({ length: playerCount }).map((_, index) => (
          <PlayerRow key={index} playerIndex={index} />
        ))}
      </div>

      <span className="players-select-text">SELECT PLAYERS: </span>

      <div className="players-tab__buttons">
        <MainButton text={"2"} onClick={() => onSetPlayerCount(2)} />
        <MainButton text={"3"} onClick={() => onSetPlayerCount(3)} />
        <MainButton text={"4"} onClick={() => onSetPlayerCount(4)} />
        <MainButton text={"5"} onClick={() => onSetPlayerCount(5)} />
        <MainButton text={"6"} onClick={() => onSetPlayerCount(6)} />
        <MainButton text={"7"} onClick={() => onSetPlayerCount(7)} />
      </div>
    </section>
  );
}
