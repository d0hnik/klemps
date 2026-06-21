import { useTranslation } from "react-i18next";
import type { RoundType } from "../../entities/roundType";
import { ROUND_CONFIG } from "../../entities/guess";

type Props = {
  roundType: RoundType;
};

export function GuessField({ roundType }: Props) {
  const roundConfig = ROUND_CONFIG[roundType];
  const { t } = useTranslation();

  return (
    <section
      className="container-border relative box-border w-[98%] sm:w-full min-h-fit rounded-xl pt-2"
      aria-labelledby="game-field-heading"
    >
      <div className="flex flex-col w-full">
        <p className="flex items-center justify-center w-full text-white text-3xl tracking-wider">
          <p className="pr-5">{t("guess.guess")}: </p>
          {t(roundConfig.titleKey)}
        </p>
        <div className="flex flex-row flex-wrap justify-center gap-3">
          {roundConfig.options.map((option) => {
            return (
              <button
                type="button"
                className="text-2xl text-black pixel-corners bg-red-300"
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
