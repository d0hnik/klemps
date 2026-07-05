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
    <div
      className={`pixel-corners flex w-[96%] min-h-[53px] player-row lg:w-full`}
      style={
        {
          "--player-color": color.color,
        } as React.CSSProperties
      }
    >
      <button
        className="flex justify-center items-center border-0 bg-transparent cursor-pointer p-0 button-animation w-8 lg:w-12"
        type="button"
        onClick={onPreviousAvatar}
      >
        <img src="/icons/arrowLeft.svg" alt="Previous" />
      </button>

      <img
        src={avatarSrc}
        alt="Player icon"
        className="object-contain flex justify-center items-center w-16 lg:w-20"
      />

      <div className="flex-1 min-w-0 flex flex-col justify-center py-2 px-3">
        <span
          className={`player-row__index pixel-corners w-fit mb-1.5 py-0.5 px-2 text-lg font-black leading-none`}
        >
          P{playerIndex}
        </span>

        <input
          type="text"
          value={playerName}
          placeholder={placeholder}
          className="w-full min-w-0 bg-transparent outline-none py-1.5 px-2 border-b border-b-[lightgray] text-white leading-[1.2em] text-[22px] truncate"
          onChange={(event) => onNameChange(event.target.value)}
        />
      </div>

      <button
        className="flex justify-center items-center border-0 bg-transparent cursor-pointer p-0 button-animation w-8 lg:w-12"
        type="button"
        onClick={onNextAvatar}
      >
        <img src="/icons/arrowRight.svg" alt="Next" />
      </button>
    </div>
  );
}
