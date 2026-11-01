import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { PLAYER_COLORS } from "../../entities/player";
import "./players.css";

type Props = {
  playerIndex: number;
  playerName: string;
  avatarSrc: string;
  onNameChange: (name: string) => void;
  onPreviousAvatar: () => void;
  onNextAvatar: () => void;
};

export function PlayerRowSetup({ playerIndex, playerName, avatarSrc, onNameChange, onPreviousAvatar, onNextAvatar }: Props) {
  const { t } = useTranslation();
  const color = PLAYER_COLORS[(playerIndex - 1) % PLAYER_COLORS.length];
  const nameLabel = t("setup.playerName", { number: playerIndex });

  return (
    <li className="player-row flex items-center rounded-lg" style={{ "--player-color": color.color } as CSSProperties}>
      <button type="button" onClick={onPreviousAvatar} aria-label={t("setup.previousAvatar", { number: playerIndex })} className="flex h-12 w-10 shrink-0 cursor-pointer items-center justify-center">
        <img src="/icons/arrowLeft.svg" alt="" className="w-5" />
      </button>
      <img src={avatarSrc} alt="" className="h-14 w-12 shrink-0 object-contain" />
      <div className="min-w-0 flex-1 px-2 py-2">
        <label htmlFor={`player-name-${playerIndex}`} className="player-row__index mb-1 block w-fit rounded px-2 text-sm font-bold">
          P{playerIndex}<span className="sr-only"> {nameLabel}</span>
        </label>
        <input
          id={`player-name-${playerIndex}`}
          type="text"
          aria-label={nameLabel}
          value={playerName}
          placeholder={nameLabel}
          maxLength={30}
          autoComplete="off"
          className="w-full border-b border-gray-400 bg-transparent py-1 text-lg text-white focus:border-amber-300"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>
      <button type="button" onClick={onNextAvatar} aria-label={t("setup.nextAvatar", { number: playerIndex })} className="flex h-12 w-10 shrink-0 cursor-pointer items-center justify-center">
        <img src="/icons/arrowRight.svg" alt="" className="w-5" />
      </button>
    </li>
  );
}
