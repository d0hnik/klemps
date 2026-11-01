import "./players.css";
import { PLAYER_COLORS } from "../../entities/player";
import { useTranslation } from "react-i18next";

type Props = {
  playerIndex: number;
  playerName: string;
  avatarSrc: string;
  onNameChange: (name: string) => void;
  onPreviousAvatar: () => void;
  onNextAvatar: () => void;
};

export function PlayerRowSetup({
  playerIndex,
  playerName,
  avatarSrc,
  onNameChange,
  onPreviousAvatar,
  onNextAvatar,
}: Props) {
  const color = PLAYER_COLORS[(playerIndex - 1) % PLAYER_COLORS.length];

  const { t } = useTranslation();

  const placeholder =
    t("players.player") + " " + playerIndex + " " + t("players.name");

  return (
    <li
      className="secondary-pixel-corners flex h-24 w-full shrink-0 snap-start bg-black/20"
      style={
        {
          "--player-color": color.color,
          "--border-color": color.color,
        } as React.CSSProperties
      }
    >
      <button
        className="flex justify-center items-center border-0 bg-transparent cursor-pointer p-0 button-animation min-h-11 w-11 shrink-0 xl:w-12"
        type="button"
        aria-label={t("setupUi.previousAvatar", { number: playerIndex })}
        onClick={onPreviousAvatar}
      >
        <img src="/icons/arrowLeft.svg" alt="" />
      </button>

      <img
        src={avatarSrc}
        alt=""
        className="object-contain flex justify-center items-center w-12 shrink-0 sm:w-16"
      />

      <div className="flex-1 min-w-0 flex flex-col justify-center py-2 px-1 sm:px-3">
        <span
          className={`player-row__index pixel-corners w-fit mb-1.5 py-0.5 px-2 text-lg font-black leading-none`}
        >
          P{playerIndex}
        </span>

        <input
          type="text"
          aria-label={placeholder}
          value={playerName}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent outline-none py-1.5 px-2 border-b border-b-[lightgray] text-white leading-[1.2em] text-base sm:text-xl focus:border-cyan-300"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>

      <button
        className="flex justify-center items-center border-0 bg-transparent cursor-pointer p-0 button-animation min-h-11 w-11 shrink-0 xl:w-12"
        type="button"
        aria-label={t("setupUi.nextAvatar", { number: playerIndex })}
        onClick={onNextAvatar}
      >
        <img src="/icons/arrowRight.svg" alt="" />
      </button>
    </li>
  );
}
