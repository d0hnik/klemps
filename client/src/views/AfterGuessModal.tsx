import { Check, Close } from "@nsmr/pixelart-react";
import type { GuessResult } from "../entities/guess";
import { useTranslation } from "react-i18next";
import { ROUND_ORDER } from "../entities/roundType";

type AfterGuessModalProps = {
  result: GuessResult;
  onClose: () => void;
};

const AFTER_GUESS_MODAL_CONFIG = {
  correct: {
    titleKey: "guessResult.correctTitle",
    messageKey: "guessResult.correctMessage",
    borderColor: "var(--color-green)",
    titleColor: "text-green-400",
    buttonColor: "bg-green-600 hover:bg-green-500",
    giveTake: "guessResult.giveOut",
    drinks: "guessResult.drinks",
    icon: (
      <Check
        size={58}
        color="green"
        className=" [filter:drop-shadow(1px_0_0_currentColor)_drop-shadow(-1px_0_0_currentColor)_drop-shadow(0_1px_0_currentColor)_drop-shadow(0_-1px_0_currentColor)]"
      />
    ),
  },
  wrong: {
    titleKey: "guessResult.wrongTitle",
    messageKey: "guessResult.wrongMessage",
    borderColor: "var(--color-red)",
    titleColor: "text-red-400",
    buttonColor: "bg-red-600 hover:bg-red-500",
    giveTake: "guessResult.take",
    drinks: "guessResult.drinks",
    icon: <Close size={52} color="red" />,
  },
} as const;

export function AfterGuessModal({ result, onClose }: AfterGuessModalProps) {
  const { t } = useTranslation();

  const drinksAmount =
    result.gameState.difficulty.drinksPerRound[
      ROUND_ORDER.indexOf(result.gameState.currentRoundType)
    ];

  console.log(result.gameState.currentRoundType);

  const variant = result.isCorrect ? "correct" : "wrong";

  const config = AFTER_GUESS_MODAL_CONFIG[variant];

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
              className="text-3xl text-[var(--result-color)]"
              style={
                {
                  "--result-color": config.borderColor,
                } as React.CSSProperties
              }
            >
              {t(config.giveTake)} {drinksAmount} {t(config.drinks)}
            </p>
          </div>
          <div className="flex justify-center items-center mt-4">
            <button
              type="button"
              className="flex justify-center button-animation items-center text-2xl text-white pixel-corners min-h-[50px] min-w-[140px] w-80 bg-[var(--color-bg)]"
              onClick={() => onClose()}
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
