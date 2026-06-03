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

  const difficultyModifier = isEasy ? "easy" : "hard";

  const selectedModifier = isSelected ? "active" : "";

  const { t } = useTranslation();

  return (
    <button
      className={`difficulty-card button-animation pixel-corners ${difficultyModifier} ${selectedModifier}`}
      onClick={() => onSelectDifficulty(difficulty.name)}
      type="button"
    >
      <p className="text-5xl text-white flex justify-center items-center">
        {difficulty.name}
      </p>
      <div className="flex flex-row items-center justify-center">
        {Array.from({ length: beerIconCount }).map((_, index) => (
          <img
            key={index}
            src="/icons/beer.svg"
            alt=""
            className="difficulty-card__beer-icon"
          />
        ))}
      </div>
      <div className="difficulty-card__drinks-tab">
        {difficulty.drinksPerRound.map((drinkCount, index) => (
          <div className="flex flex-row justify-around" key={index}>
            <span className="text-white">
              {t("difficulty.round")} {index + 1}.
            </span>
            <span className={` ${isEasy ? "text-green-600" : "text-red-600"}`}>
              {drinkCount}{" "}
              {drinkCount == 1 ? t("drinks.single") : t("drinks.plural")}
            </span>
          </div>
        ))}
      </div>
      <div
        className={`difficulty-card__footer flex justify-center items-center mt-5 text-white ${difficultyModifier}`}
      >
        <p className="mr-3">
          <IconStarFilled />
        </p>
        {difficulty.name}
      </div>
    </button>
  );
}
