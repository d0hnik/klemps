import { useState } from "react";
import { PLAYER_AVATARS, type NewPlayerInput } from "../../entities/player";
import { MainButton } from "../Buttons/MainButton";
import { Title } from "../Title/Title";
import { PlayerRowSetup } from "./PlayerRowSetup";
import "./players.css";
import {
  getDefaultAvatarIndex,
  getNextAvatarIndex,
  PLAYER_COUNT_OPTIONS,
} from "../helpers/players";
import { useTranslation } from "react-i18next";

type Props = {
  onSetPlayerCount: (count: number) => void;
  onSetPlayerName: (playerIndex: number, name: string) => void;
  playerCount: number;
  players: NewPlayerInput[];
};

export function PlayersTabSetup({
  onSetPlayerCount,
  onSetPlayerName,
  playerCount,
  players,
}: Props) {
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

  const { t } = useTranslation();

  return (
    <section className="players-tab relative box-border rounded-xl pt-8 px-6 pb-6 w-full max-w-[510px]">
      <Title index="1" title="PLAYERS" />

      <div className="flex flex-col gap-y-3 mb-4">
        {players.map((player, index) => {
          const playerIndex = index + 1;

          const selectedAvatarIndex =
            selectedAvatarIndexes[index] ?? getDefaultAvatarIndex(index);

          player.avatarSrc = PLAYER_AVATARS[selectedAvatarIndex];

          return (
            <PlayerRowSetup
              key={playerIndex}
              playerIndex={playerIndex}
              playerName={player.name}
              avatarSrc={player.avatarSrc}
              onNameChange={(name) => onSetPlayerName(playerIndex, name)}
              onPreviousAvatar={() => changePlayerAvatar(playerIndex, "left")}
              onNextAvatar={() => changePlayerAvatar(playerIndex, "right")}
            />
          );
        })}
      </div>

      <span className="text-xl text-white">{t("game.selectPlayers")}: </span>

      <div className="grid grid-cols-3 gap-3 w-full">
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
