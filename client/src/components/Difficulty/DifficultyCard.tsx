import type {
  Difficulty,
  DifficultyName,
} from "../../entities/difficulty/difficulty";
import "./difficultyCard.css";
import { IconStarFilled } from "@tabler/icons-react";

type Props = {
  difficulty: Difficulty;
  onSelectDifficulty: (difficultyName: DifficultyName) => void;
};

export function DifficultyCard({ difficulty }: Props) {
  const is_easy: boolean = difficulty.name === "EASY";
  return (
    <section
      className={`difficulty-card pixel-corners ${is_easy ? "easy active" : "hard"}`}
    >
      <p className="difficulty-card__name">{difficulty.name}</p>
      <div className="difficulty-card__icons">
        {is_easy ? (
          <img src="/icons/beer.svg" alt="Beer icon" className="beer-icon" />
        ) : (
          <>
            <img src="/icons/beer.svg" alt="Beer icon" className="beer-icon" />
            <img src="/icons/beer.svg" alt="Beer icon" className="beer-icon" />
          </>
        )}
      </div>
      <div className="difficulty-card__drinks-tab">
        {difficulty.drinksPerRound.map((drinkCount, index) => (
          <div className="difficulty-card__drink-row">
            <span className="difficulty-card__round-number">
              ROUND {index + 1}.
            </span>
            <span
              className={`difficulty-card__round-drink ${
                is_easy ? "easy" : "hard"
              }`}
            >
              {drinkCount} DRINK
            </span>
          </div>
        ))}
      </div>
      <div className={`difficulty-card__footer ${is_easy ? "easy" : "hard"}`}>
        <p className="difficulty-card__star">
          <IconStarFilled />
        </p>
        {difficulty.name}
      </div>
    </section>
  );
}
