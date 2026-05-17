import type { DifficultyName } from "../../entities/difficulty/difficulty";
import {
  EASY_DIFFICULTY,
  HARD_DIFFICULTY,
} from "../../entities/difficulty/difficulty.config";
import { Title } from "../Title/Title";
import { DifficultyCard } from "./DifficultyCard";
import "./difficultyTab.css";

type Props = {
  selectedDifficulty: DifficultyName;
  onSelectDifficulty: (difficultyName: DifficultyName) => void;
};

export function DifficultyTab({
  selectedDifficulty,
  onSelectDifficulty,
}: Props) {
  return (
    <section className="difficulty-tab">
      <Title index={"2"} title={"DIFFICULTY"} />
      <DifficultyCard
        difficulty={EASY_DIFFICULTY}
        onSelectDifficulty={onSelectDifficulty}
        selectedDifficulty={selectedDifficulty}
      />
      <DifficultyCard
        difficulty={HARD_DIFFICULTY}
        onSelectDifficulty={onSelectDifficulty}
        selectedDifficulty={selectedDifficulty}
      />
    </section>
  );
}
