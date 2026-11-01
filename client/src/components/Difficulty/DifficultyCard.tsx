import { useTranslation } from "react-i18next";
import type {
  Difficulty,
  DifficultyName,
} from "../../entities/difficulty/difficulty";
import "./difficultyCard.css";
import { IconStarFilled } from "@tabler/icons-react";

type Props = {
  difficulty: Difficulty;
  onSelectDifficulty: (difficultyName: DifficultyName) => void;
  selectedDifficulty: DifficultyName;
};

export function DifficultyCard({
  difficulty,
  onSelectDifficulty,
  selectedDifficulty,
}: Props) {
  const isEasy = difficulty.name === "EASY";

  const isSelected = difficulty.name === selectedDifficulty;

  const beerIconCount = isEasy ? 1 : 2;

  const backgroundColor = isEasy
    ? "bg-[var(--color-green)]"
    : "bg-[var(--color-red)]";

  const selectedModifier = isSelected ? "active" : "";

  const { t } = useTranslation();

  return (
    <button
      className={`difficulty-card button-animation pixel-corners w-full min-w-0 cursor-pointer rounded-xl ${backgroundColor} ${selectedModifier}`}
      aria-pressed={isSelected}
      onClick={() => onSelectDifficulty(difficulty.name)}
      type="button"
    >
      <p className="text-2xl text-white uppercase sm:text-4xl xl:text-5xl flex justify-center items-center">
        {t(isEasy ? "difficulty.easy" : "difficulty.hard")}
      </p>
      <div className="flex flex-row items-center justify-center">
        {Array.from({ length: beerIconCount }).map((_, index) => (
          <img
            key={index}
            src="/icons/beer.svg"
            alt=""
            width={112}
            height={112}
            className="size-12 sm:size-20 xl:size-28"
          />
        ))}
      </div>
      <div className="flex flex-col bg-black/60 text-sm sm:text-base xl:text-xl">
        {difficulty.drinksPerRound.map((drinkCount, index) => (
          <div className="flex justify-between gap-1 px-1 sm:px-2" key={index}>
            <span className="text-white">
              {t("difficulty.round")} {index + 1}.
            </span>
            <span className={` ${isEasy ? "text-green-600" : "text-red-600"}`}>
              {drinkCount}{" "}
              {drinkCount === 1 ? t("drinks.single") : t("drinks.plural")}
            </span>
          </div>
        ))}
      </div>
      <div
        className="mt-5 flex items-center justify-center bg-black/60 text-base text-white uppercase sm:text-xl xl:text-2xl"
      >
        <p className="mr-1 sm:mr-3">
          <IconStarFilled className="size-4 sm:size-6" />
        </p>
        {t(isEasy ? "difficulty.easy" : "difficulty.hard")}
      </div>
    </button>
  );
}
