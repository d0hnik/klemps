import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { PLAYER_COLORS, type Player } from "../../entities/player";

type Props = {
  playerIndex: number;
  player: Player;
  amount: number;
  canIncrease: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
};

export function PlayerRowDrinksGiver({ playerIndex, player, amount, canIncrease, onIncrease, onDecrease }: Props) {
  const { t } = useTranslation();
  const color = PLAYER_COLORS[(playerIndex - 1) % PLAYER_COLORS.length].color;

  return (
    <div
      className="secondary-pixel-corners flex flex-wrap items-center justify-between gap-3 bg-black/20 p-2"
      style={{ "--border-color": color } as CSSProperties}
    >
      <div className="flex min-w-0 flex-1 basis-32 items-center gap-2">
        <img src={player.avatarSrc} alt="" className="size-10 shrink-0 object-contain" />
        <div className="min-w-0">
          <p className="text-xs text-cyan-200">P{playerIndex}</p>
          <p title={player.name} className="truncate text-lg">{player.name}</p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label={t("drinkAllocation.remove", { name: player.name })}
          disabled={amount === 0}
          onClick={onDecrease}
          className="size-11 cursor-pointer border-2 border-cyan-300 bg-cyan-950 text-2xl hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-30"
        >−</button>
        <output aria-label={t("drinkAllocation.assigned", { name: player.name })} className="min-w-6 text-center text-2xl tabular-nums">{amount}</output>
        <button
          type="button"
          aria-label={t("drinkAllocation.add", { name: player.name })}
          disabled={!canIncrease}
          onClick={onIncrease}
          className="size-11 cursor-pointer border-2 border-cyan-300 bg-cyan-950 text-2xl hover:bg-cyan-900 disabled:cursor-not-allowed disabled:opacity-30"
        >+</button>
      </div>
    </div>
  );
}
