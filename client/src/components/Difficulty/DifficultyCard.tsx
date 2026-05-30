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
      className={`difficulty-card pixel-corners ${difficultyModifier} ${selectedModifier}`}
      onClick={() => onSelectDifficulty(difficulty.name)}
      type="button"
    >
      <p className="difficulty-card__name">{difficulty.name}</p>
      <div className="difficulty-card__icons">
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
          <div className="difficulty-card__drink-row" key={index}>
            <span className="difficulty-card__round-number">
              {t("difficulty.round")} {index + 1}.
            </span>
            <span
              className={`difficulty-card__round-drink ${
                isEasy ? "easy" : "hard"
              }`}
            >
              {drinkCount} {t("drinks.single")}
            </span>
          </div>
        ))}
      </div>
      <div className={`difficulty-card__footer ${difficultyModifier}`}>
        <p className="difficulty-card__star">
          <IconStarFilled />
        </p>
        {difficulty.name}
      </div>
    </button>
  );
}
