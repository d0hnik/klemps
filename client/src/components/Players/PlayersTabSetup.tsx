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
    <section className="container-border relative box-border rounded-xl w-[98%] max-w-[510px] pt-7 pb-6 lg:pt-8 lg:px-6 lg:pb-6 lg:w-full">
      <Title index="1" title="PLAYERS" />

      <div className="h-[255px] overflow-y-auto pr-2 overflow-visible pr-0 sm:max-h-[360px] md:max-h-[360px]">
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

      <div className="flex grid grid-cols-3 gap-3 w-[96%] pl-2 lg:w-full">
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
