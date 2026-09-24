import "./players.css";
import { PLAYER_COLORS, type Player } from "../../entities/player";

type Props = {
  playerIndex: number;
  player: Player;
};

export function PlayerRowDrinksGiver({ playerIndex, player }: Props) {
  const color = PLAYER_COLORS[(playerIndex - 1) % PLAYER_COLORS.length];

  return (
    <div
      className={`player-row-thin-border flex w-[100%] sm:w-full items-stretch`}
      style={
        {
          "--player-color": color.color,
        } as React.CSSProperties & Record<"--player-color", string>
      }
    >
      <div className="flex w-15 sm:w-20 shrink-0 items-center justify-center">
        <img
          src={player.avatarSrc}
          alt={`${player.name} avatar`}
          className="max-h-[72px] max-w-full object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
        <span className="player-row__index pixel-corners mb-1.5 w-fit px-2 py-0.5 text-lg font-black leading-none">
          P{playerIndex}
        </span>

        <p className="m-0 truncate text-xl text-white">{player.name}</p>
      </div>
    </div>
  );
}
