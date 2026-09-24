import "./players.css";
import { PLAYER_COLORS, type Player } from "../../entities/player";
import { PlayerDrinksButton } from "../Buttons/playerDrinksButton";
import { PlayerAssignedDrinksCounter } from "../Counters/PlayerAssignedDrinksCounter";

type Props = {
  playerIndex: number;
  player: Player;
  assignedDrinks: number;
  onIncrement: () => void;
  onDecrement: () => void;
  incrementionDisabled: boolean;
};

export function PlayerRowGivingOutDrinks({
  playerIndex,
  player,
  assignedDrinks,
  onIncrement,
  onDecrement,
  incrementionDisabled,
}: Props) {
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

      <div className="flex">
        <div className="flex justify-center items-center gap-2 mr-4">
          <PlayerDrinksButton
            onClick={onDecrement}
            type={"decrement"}
            disabled={assignedDrinks == 0}
          />
          <PlayerAssignedDrinksCounter number={assignedDrinks} />
          <PlayerDrinksButton
            onClick={onIncrement}
            type={"increment"}
            disabled={incrementionDisabled}
          />
        </div>
      </div>
    </div>
  );
}
