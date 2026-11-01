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
    <section className="container-border relative w-full min-w-0 max-w-[510px] rounded-xl pt-7 pb-6 xl:px-6 xl:pt-8">
      <Title index="1" title="PLAYERS" />

      <div className="h-64 overflow-y-auto">
        <ol className="relative mb-4 flex flex-col items-center gap-y-3">
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
        </ol>
      </div>

      <span className="text-xl text-white">{t("game.selectPlayers")}: </span>

      <div className="grid w-[96%] grid-cols-3 gap-2 pl-2 sm:gap-3 xl:w-full">
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
