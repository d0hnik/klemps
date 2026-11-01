import { useState, type CSSProperties } from "react";
import { Check, Close } from "@nsmr/pixelart-react";
import { useTranslation } from "react-i18next";
import type { GameState } from "../../entities/gameState";
import { getDrinksForRound, type DrinkAllocation } from "../../entities/turn";
import { PlayerRowDrinksGiver } from "../Players/PlayerRowDrinksGiver";
import { GameModal } from "./GameModal";

type Props = {
  isCorrect: boolean;
  gameState: GameState;
  saveError: boolean;
  onContinue: (allocation: DrinkAllocation) => void;
};

export function AfterGuessModal({ isCorrect, gameState, saveError, onContinue }: Props) {
  const { t } = useTranslation();
  const [allocation, setAllocation] = useState<DrinkAllocation>({});
  const drinks = getDrinksForRound(gameState);
  const remaining = drinks - Object.values(allocation).reduce((sum, count) => sum + count, 0);

  function changeAllocation(playerId: string, change: number) {
    setAllocation((current) => {
      const assigned = Object.values(current).reduce((sum, count) => sum + count, 0);
      const amount = (current[playerId] || 0) + change;
      if (amount < 0 || (change > 0 && assigned >= drinks)) return current;
      return { ...current, [playerId]: amount };
    });
  }

  const footer = (
    <>
      {isCorrect && (
        <p role="status" className="mb-3 text-center text-amber-200">
          {remaining === 0 ? t("drinkAllocation.complete") : t("drinkAllocation.remaining", { count: remaining })}
        </p>
      )}
      {saveError && <p role="alert" className="mb-3 text-red-200">{t("drinkAllocation.saveError")}</p>}
      <button
        type="button"
        disabled={isCorrect && remaining !== 0}
        onClick={() => onContinue(allocation)}
        className="secondary-pixel-corners min-h-12 w-full cursor-pointer bg-green-500 px-4 py-3 text-xl font-bold text-green-950 hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ "--border-color": "#86efac" } as CSSProperties}
      >
        {t("drinkAllocation.continue")}
      </button>
    </>
  );

  return (
    <GameModal title={t(isCorrect ? "guessResult.correctTitle" : "guessResult.wrongTitle")} borderColor={isCorrect ? "#86efac" : "#fca5a5"} footer={footer}>
      <div className="mb-4 flex justify-center" aria-hidden="true">
        {isCorrect ? <Check size={40} color="#86efac" /> : <Close size={40} color="#fca5a5" />}
      </div>
      <p className="text-center text-cyan-100">{t(isCorrect ? "guessResult.correctMessage" : "guessResult.wrongMessage")}</p>
      <p className={`my-3 text-center text-2xl ${isCorrect ? "text-green-200" : "text-red-200"}`}>
        {t(isCorrect ? "guessResult.giveOut" : "guessResult.take")} {drinks} {t(drinks === 1 ? "drinks.single" : "drinks.plural")}
      </p>
      {isCorrect && (
        <div className="space-y-3">
          {gameState.players.map((player, index) => index !== gameState.currentPlayerIndex && (
            <PlayerRowDrinksGiver
              key={player.id}
              playerIndex={index + 1}
              player={player}
              amount={allocation[player.id] || 0}
              canIncrease={remaining > 0}
              onIncrease={() => changeAllocation(player.id, 1)}
              onDecrease={() => changeAllocation(player.id, -1)}
            />
          ))}
        </div>
      )}
    </GameModal>
  );
}
