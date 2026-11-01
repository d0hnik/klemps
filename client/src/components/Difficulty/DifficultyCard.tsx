import { useTranslation } from "react-i18next";
import type { Difficulty, DifficultyName } from "../../entities/difficulty/difficulty";

type Props = {
  difficulty: Difficulty;
  onSelectDifficulty: (difficultyName: DifficultyName) => void;
  selectedDifficulty: DifficultyName;
};

export function DifficultyCard({ difficulty, onSelectDifficulty, selectedDifficulty }: Props) {
  const { t } = useTranslation();
  const isEasy = difficulty.name === "EASY";
  const isSelected = difficulty.name === selectedDifficulty;
  const name = t(isEasy ? "difficulty.easy" : "difficulty.hard");

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelectDifficulty(difficulty.name)}
      className={`min-w-0 cursor-pointer rounded-lg border-4 p-3 text-white ${isEasy ? "bg-green-800 hover:bg-green-700" : "bg-red-800 hover:bg-red-700"} ${isSelected ? "border-amber-300" : "border-transparent"}`}
    >
      <span className="block text-3xl uppercase">{name}</span>
      <span aria-hidden="true" className="my-3 flex justify-center">
        <img src="/icons/beer.svg" alt="" className="size-16" />
        {!isEasy && <img src="/icons/beer.svg" alt="" className="size-16" />}
      </span>
      <span className="block rounded bg-black/40 p-2">
        {difficulty.drinksPerRound.map((drinkCount, index) => (
          <span key={index} className="flex justify-between gap-2 py-1 text-sm sm:text-base">
            <span>{t("difficulty.round")} {index + 1}</span>
            <span>{drinkCount} {t(drinkCount === 1 ? "drinks.single" : "drinks.plural")}</span>
          </span>
        ))}
      </span>
      <span className="mt-3 block text-sm">{t(isSelected ? "setup.selected" : "setup.select")}</span>
    </button>
  );
}
