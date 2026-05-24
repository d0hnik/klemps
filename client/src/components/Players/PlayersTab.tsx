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

function getDefaultAvatarIndex(playerIndex: number) {
  return playerIndex % PLAYER_AVATARS.length;
}

function getNextAvatarIndex(avatarIndex: number, direction: "left" | "right") {
  if (direction === "left") {
    return avatarIndex === 0 ? PLAYER_AVATARS.length - 1 : avatarIndex - 1;
  }

  return avatarIndex === PLAYER_AVATARS.length - 1 ? 0 : avatarIndex + 1;
}

export function PlayersTab({ onSetPlayerCount, playerCount }: Props) {
  const [selectedAvatarIndexes, setSelectedAvatarIndexes] = useState<number[]>(
    () =>
      Array.from({ length: playerCount }, (_, index) =>
        getDefaultAvatarIndex(index),
      ),
  );

  function changePlayerAvatar(
    playerIndex: number,
    direction: "left" | "right",
  ) {
    const arrayIndex = playerIndex - 1;

    setSelectedAvatarIndexes((current) => {
      const next = [...current];

      const currentAvatarIndex =
        next[arrayIndex] ?? getDefaultAvatarIndex(arrayIndex);

      next[arrayIndex] = getNextAvatarIndex(currentAvatarIndex, direction);

      return next;
    });
  }

  return (
    <section className="players-tab">
      <Title index="1" title="PLAYERS" />

      <div className="players-tab__rows">
        {Array.from({ length: playerCount }).map((_, index) => {
          const playerIndex = index + 1;

          const selectedAvatarIndex =
            selectedAvatarIndexes[index] ?? getDefaultAvatarIndex(index);

          return (
            <PlayerRow
              key={playerIndex}
              playerIndex={playerIndex}
              avatarSrc={PLAYER_AVATARS[selectedAvatarIndex]}
              onPreviousAvatar={() => changePlayerAvatar(playerIndex, "left")}
              onNextAvatar={() => changePlayerAvatar(playerIndex, "right")}
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
