import { useTranslation } from "react-i18next";
import { ROUND_ORDER } from "../../entities/roundType";
import type { GameState } from "../../entities/gameState";
import { PlayerRowGivingOutDrinks } from "../Players/PlayerRowDrinksGiver";
import { AFTER_GUESS_MODAL_CONFIG } from "../helpers/constants";
import { useState } from "react";
import { ContinueButton } from "../Buttons/ContinueButton";

type AfterGuessModalProps = {
  isCorrect: boolean;
  gameState: GameState;
  onClose: () => void;
};

export function AfterGuessModal({
  isCorrect,
  gameState,
  onClose,
}: AfterGuessModalProps) {
  const { t } = useTranslation();

  const drinksAmount =
    gameState.difficulty.drinksPerRound[
      ROUND_ORDER.indexOf(gameState.currentRoundType)
    ];

  const variant = isCorrect ? "correct" : "wrong";

  const config = AFTER_GUESS_MODAL_CONFIG[variant];

  const roundIndex = ROUND_ORDER.indexOf(gameState.currentRoundType);

  const maxDrinks = gameState.difficulty.drinksPerRound[roundIndex];

  const [assignedDrinks, setAssignedDrinks] = useState<number[]>(() =>
    Array(gameState.players.length).fill(0),
  );

  const totalAssignedDrinks = assignedDrinks.reduce(
    (total, drinks) => total + drinks,
    0,
  );

  const allDrinksAssigned = totalAssignedDrinks === maxDrinks;

  const incrementDrinks = (playerIndex: number): void => {
    if (totalAssignedDrinks >= maxDrinks) {
      return;
    }

    setAssignedDrinks((previous) => {
      const next = [...previous];

      next[playerIndex] += 1;

      return next;
    });
  };

  const decrementDrinks = (playerIndex: number): void => {
    setAssignedDrinks((previous) => {
      if (previous[playerIndex] === 0) {
        return previous;
      }

      const next = [...previous];

      next[playerIndex] -= 1;

      return next;
    });
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60 px-4
      "
      aria-label="Guess result"
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl border-5 border-[var(--result-color)]
          bg-[var(--color-dark-bg)] p-6 text-white
          shadow-2xl
        "
        style={
          {
            "--result-color": config.borderColor,
          } as React.CSSProperties
        }
      >
        <div className="flex flex-col items-center">
          {config.icon}
          <p className="text-center text-4xl tracking-wider text-white">
            {t(config.titleKey)}
          </p>

          <div className="mt-3 flex w-full max-w-[320px] items-center justify-center">
            <div
              className="h-[2px] flex-1 bg-[var(--result-color)]"
              style={
                {
                  "--result-color": config.borderColor,
                } as React.CSSProperties
              }
            />

            <div
              className="mx-2 size-2 rotate-45 border-2 border-[var(--result-color)] bg-slate-900"
              style={
                {
                  "--result-color": config.borderColor,
                } as React.CSSProperties
              }
            />

            <div
              className="h-[2px] flex-1 bg-[var(--result-color)]"
              style={
                {
                  "--result-color": config.borderColor,
                } as React.CSSProperties
              }
            />
          </div>

          <div className="flex mt-2 flex-col justify-center items-center gap-2">
            <p>{t(config.messageKey)}</p>
            <p
              className="text-3xl tracking-wider text-[var(--result-color)]"
              style={
                {
                  "--result-color": config.borderColor,
                } as React.CSSProperties
              }
            >
              {t(config.giveTake)} {drinksAmount} {t(config.drinks)}
            </p>
          </div>
          {isCorrect &&
            gameState.players.map((player, index) => {
              if (index == gameState.currentPlayerIndex) {
                return null;
              }
              return (
                <PlayerRowGivingOutDrinks
                  key={index}
                  playerIndex={index + 1}
                  player={player}
                  assignedDrinks={assignedDrinks[index]}
                  onIncrement={() => incrementDrinks(index)}
                  onDecrement={() => decrementDrinks(index)}
                  incrementionDisabled={allDrinksAssigned}
                />
              );
            })}
          <div className="flex justify-center items-center mt-4">
            <ContinueButton onClick={onClose} disabled={!allDrinksAssigned} />
          </div>
        </div>
      </div>
    </div>
  );
}
