import { useTranslation } from "react-i18next";
import type { RoundType } from "../../entities/roundType";
import { ROUND_CONFIG, type GuessValue } from "../../entities/guess";
import type { CSSProperties } from "react";

type Props = {
  roundType: RoundType;
  onGuess: (guess: GuessValue) => void;
};

export function GuessField({ roundType, onGuess }: Props) {
  const roundConfig = ROUND_CONFIG[roundType];
  const { t } = useTranslation();

  return (
    <section
      className="secondary-pixel-corners w-full min-w-0 bg-black/15 pt-4"
      aria-labelledby="guess-field-heading"
    >
      <div className="flex flex-col w-full">
        <h2 id="guess-field-heading" className="px-2 text-center text-xl tracking-wider text-white sm:text-2xl">
          {t("guess.guess")}: {t(roundConfig.titleKey)}
        </h2>
        <div className={`grid grid-cols-2 gap-3 p-3 ${roundConfig.options.length === 4 ? "sm:grid-cols-4" : ""}`}>
          {roundConfig.options.map((option) => {
            return (
              <button
                type="button"
                key={option.labelKey}
                className="secondary-pixel-corners button-animation flex min-h-14 min-w-0 cursor-pointer items-center justify-center px-2 text-lg font-bold text-white guess-option-button sm:text-2xl"
                style={
                  {
                    "--guess-button-color": option.buttonColor,
                    "--border-color": "#d8e6e2",
                  } as CSSProperties
                }
                onClick={() => onGuess(option.value)}
              >
                {t(option.labelKey)}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
