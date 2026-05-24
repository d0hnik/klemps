import { useState } from "react";
import { PLAYER_AVATARS } from "../../entities/player";
import { MainButton } from "../Buttons/MainButton";
import { Title } from "../Title/Title";
import { PlayerRow } from "./PlayerRow";
import "./players.css";

type Props = {
  onSetPlayerCount: (count: number) => void;
  playerCount: number;
};

const PLAYER_COUNT_OPTIONS = [2, 3, 4, 5, 6, 7];

export function PlayersTab({ onSetPlayerCount, playerCount }: Props) {
  const [selectedAvatarIndexes, setSelectedAvatarIndexes] = useState<number[]>(
    Array.from(
      { length: playerCount },
      (_, index) => index % PLAYER_AVATARS.length,
    ),
  );

  return (
    <section className="players-tab">
      <Title index={"1"} title={"PLAYERS"} />

      <div className="players-tab__rows">
        {Array.from({ length: playerCount }).map((_, index) => {
          const selectedAvatarIndex = selectedAvatarIndexes[index];
          return (
            <PlayerRow
              key={index}
              playerIndex={index + 1}
              avatarSrc={PLAYER_AVATARS[selectedAvatarIndex]}
            />
          );
        })}
      </div>

      <span className="players-select-text">SELECT PLAYERS: </span>

      <div className="players-tab__buttons">
        {PLAYER_COUNT_OPTIONS.map((count) => (
          <MainButton
            key={count}
            text={String(count)}
            active={playerCount === count}
            onClick={() => onSetPlayerCount(count)}
          />
        ))}
      </div>
    </section>
  );
}
