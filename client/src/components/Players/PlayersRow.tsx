import "./players.css";
import { PLAYER_COLORS, type Player } from "../../entities/player";
import { useTranslation } from "react-i18next";

type Props = {
  playerIndex: number;
  player: Player;
};

export function PlayerRow({ playerIndex, player }: Props) {
  const color = PLAYER_COLORS[(playerIndex - 1) % PLAYER_COLORS.length];

  const { t } = useTranslation();

  return (
    <div
      className="pixel-corners w-full flex min-h-[83px] items-stretch player-row"
      style={
        {
          "--player-color": color.color,
        } as React.CSSProperties & Record<"--player-color", string>
      }
    >
      <img
        src={player.avatarSrc}
        alt="Player icon"
        className="w-20 object-contain flex justify-center items-center"
      />

      <div className="flex-1 min-w-0 flex flex-col justify-center py-2 px-3">
        <span
          className={`player-row__index pixel-corners w-fit mb-1.5 py-0.5 px-2 text-lg font-black leading-none`}
        >
          P{playerIndex}
        </span>

        <p className="text-2xl text-white">{player.name}</p>
      </div>

      <div>HELLO</div>
    </div>
  );
}
