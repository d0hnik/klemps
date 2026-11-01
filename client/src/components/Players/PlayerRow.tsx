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
      className={`pixel-corners player-row flex h-24 w-full shrink-0 items-stretch ${
        isActive ? "player-row--active" : ""
      }`}
      style={
        {
          "--player-color": color.color,
        } as React.CSSProperties & Record<"--player-color", string>
      }
    >
      <div className="flex w-12 sm:w-16 shrink-0 items-center justify-center">
        <img
          src={player.avatarSrc}
          alt={`${player.name} avatar`}
          className="max-h-[72px] max-w-full object-contain"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center px-1 py-2 sm:px-2">
        <span className="player-row__index pixel-corners mb-1.5 w-fit px-2 py-0.5 text-lg font-black leading-none">
          P{playerIndex}
        </span>

        <p title={player.name} className="m-0 truncate text-xl text-white sm:text-2xl">{player.name}</p>
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1 pr-1 sm:gap-2 sm:pr-2">
        <DrinksCounter type="taken" count={player.drinksTaken} />
        <DrinksCounter type="given" count={player.drinksGiven} />
      </div>
    </div>
  );
}
