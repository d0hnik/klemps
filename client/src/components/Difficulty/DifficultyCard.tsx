import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { IconStarFilled } from "@tabler/icons-react";
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
      aria-label={name}
      aria-pressed={isSelected}
      onClick={() => onSelectDifficulty(difficulty.name)}
      className={`secondary-pixel-corners button-animation min-w-0 cursor-pointer pt-4 text-white ${isEasy ? "bg-green-800" : "bg-red-800"}`}
      style={{ "--border-color": isSelected ? "var(--color-panel)" : "#83a5a8" } as CSSProperties}
    >
      <span className="block text-4xl uppercase">{name}</span>
      <span aria-hidden="true" className="my-4 flex justify-center">
        <img src="/icons/beer.svg" alt="" width={80} height={80} className="size-20" />
        {!isEasy && <img src="/icons/beer.svg" alt="" width={80} height={80} className="size-20" />}
      </span>
      <span className="block bg-black/40 px-3 py-2">
        {difficulty.drinksPerRound.map((drinkCount, index) => (
          <span key={index} className="flex justify-between gap-2 py-1 text-base">
            <span>{t("difficulty.round")} {index + 1}</span>
            <span className={isEasy ? "text-green-200" : "text-red-200"}>
              {drinkCount} {t(drinkCount === 1 ? "drinks.single" : "drinks.plural")}
            </span>
          </span>
        ))}
      </span>
      <span className={`flex items-center justify-center gap-2 py-3 text-lg ${isSelected ? "bg-black/30 text-amber-200" : "bg-black/10"}`}>
        <IconStarFilled size={20} aria-hidden="true" />
        {t(isSelected ? "setupUi.selected" : "setupUi.select")}
      </span>
    </button>
  );
}
