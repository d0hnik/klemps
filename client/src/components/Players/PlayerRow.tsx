import "./players.css";
import { PLAYER_COLORS, type Player } from "../../entities/player";
import { DrinksCounter } from "./DrinksCounter";

type Props = {
  playerIndex: number;
  player: Player;
  isActive: boolean;
  rowRef?: (node: HTMLDivElement | null) => void;
};

export function PlayerRow({ playerIndex, player, isActive, rowRef }: Props) {
  const color = PLAYER_COLORS[(playerIndex - 1) % PLAYER_COLORS.length];

  return (
    <div
      ref={rowRef}
      className={`pixel-corners player-row flex w-[96%] sm:w-full items-stretch ${
        isActive ? "player-row--active" : ""
      }`}
      style={
        {
          "--player-color": color.color,
        } as React.CSSProperties & Record<"--player-color", string>
      }
    >
      <div className="flex w-16 sm:w-20 shrink-0 items-center justify-center">
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

        <p className="m-0 truncate text-2xl text-white">{player.name}</p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-3 pr-4 sm:gap-5">
        <DrinksCounter type="taken" count={player.drinksTaken} />
        <DrinksCounter type="given" count={player.drinksGiven} />
      </div>
    </div>
  );
}
