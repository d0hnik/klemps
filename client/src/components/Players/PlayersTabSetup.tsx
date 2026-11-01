import { useState, type CSSProperties } from "react";
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
    <section className="relative w-full min-w-0 max-w-[510px]">
      <Title index="1" title={t("players.players")} className="z-10" />

      <div className="secondary-pixel-corners bg-black/15 px-2 pt-8 pb-5 sm:px-5">
        <p className="mb-4 text-sm text-cyan-100">{t("setupUi.playersHint")}</p>

        <div className="setup-player-list h-76 snap-y snap-mandatory overflow-y-auto">
          <ol className="relative flex flex-col gap-2">
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
            {playerCount < 3 && (
              <li className="h-24 shrink-0 snap-start">
                <button
                  type="button"
                  onClick={() => onSetPlayerCount(3)}
                  className="secondary-pixel-corners flex h-full w-full cursor-pointer items-center justify-center gap-3 bg-black/10 text-cyan-200 hover:bg-white/5 focus-visible:bg-white/10"
                  style={{ "--border-color": "#315459" } as CSSProperties}
                >
                  <span aria-hidden="true" className="text-2xl">+</span>
                  {t("setupUi.addPlayer")}
                </button>
              </li>
            )}
          </ol>
        </div>
        <p className="h-6 text-center text-xs leading-6 text-cyan-200">
          {playerCount > 3 ? t("setupUi.scrollHint") : ""}
        </p>

        <span className="mb-2 block text-lg text-white">{t("game.selectPlayers")}: </span>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {PLAYER_COUNT_OPTIONS.map((count) => (
            <MainButton
              key={count}
              text={String(count)}
              active={playerCount === count}
              onClick={() => onSetPlayerCount(count)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
