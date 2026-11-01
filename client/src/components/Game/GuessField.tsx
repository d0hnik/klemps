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
      className="container-border relative w-full min-w-0 rounded-xl pt-2"
      aria-labelledby="guess-field-heading"
    >
      <div className="flex flex-col w-full">
        <h2 id="guess-field-heading" className="px-2 text-center text-xl tracking-wider text-white sm:text-2xl">
          {t("guess.guess")}: {t(roundConfig.titleKey)}
        </h2>
        <div className="grid grid-cols-2 gap-3 p-3 sm:flex sm:flex-wrap sm:justify-center">
          {roundConfig.options.map((option) => {
            return (
              <button
                type="button"
                key={option.labelKey}
                className="flex justify-center button-animation items-center text-base text-white pixel-corners guess-option-button min-h-14 min-w-0 px-2 sm:min-w-36 sm:text-2xl"
                style={
                  {
                    "--guess-button-color": option.buttonColor,
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
