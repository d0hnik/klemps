import { useTranslation } from "react-i18next";
import type { RoundType } from "../../entities/roundType";
import { ROUND_CONFIG } from "../../entities/guess";
import type { CSSProperties } from "react";

type Props = {
  roundType: RoundType;
};

export function GuessField({ roundType }: Props) {
  const roundConfig = ROUND_CONFIG[roundType];
  const { t } = useTranslation();

  console.log(roundConfig.options);

  return (
    <section
      className="container-border relative box-border w-[98%] sm:w-full min-h-fit rounded-xl pt-2"
      aria-labelledby="game-field-heading"
    >
      <div className="flex flex-col w-full">
        <span className="flex items-center justify-center w-full text-white text-3xl tracking-wider">
          <p className="pr-5">{t("guess.guess")}: </p>
          {t(roundConfig.titleKey)}
        </span>
        <div className="flex flex-row flex-wrap justify-center gap-3 pt-5 pb-5">
          {roundConfig.options.map((option) => {
            return (
              <button
                type="button"
                key={option.labelKey}
                className="flex justify-center button-animation items-center text-2xl text-white pixel-corners guess-option-button min-h-[50px] min-w-[140px]"
                style={
                  {
                    "--guess-button-color": option.buttonColor,
                  } as CSSProperties
                }
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
