import { useTranslation } from "react-i18next";
import type { DifficultyName } from "../../entities/difficulty/difficulty";
import { DIFFICULTIES } from "../../entities/difficulty/difficulty.config";
import { Title } from "../Title/Title";
import { DifficultyCard } from "./DifficultyCard";

type Props = {
  selectedDifficulty: DifficultyName;
  onSelectDifficulty: (difficultyName: DifficultyName) => void;
};

export function DifficultyTab({ selectedDifficulty, onSelectDifficulty }: Props) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="setup-difficulty" className="container-border relative min-w-0 rounded-xl px-3 pt-8 pb-5 sm:px-5">
      <Title id="setup-difficulty" index="2" title={t("difficulty.title")} />
      <div className="grid gap-4 sm:grid-cols-2">
        {DIFFICULTIES.map((difficulty) => (
          <DifficultyCard key={difficulty.name} difficulty={difficulty} onSelectDifficulty={onSelectDifficulty} selectedDifficulty={selectedDifficulty} />
        ))}
      </div>
    </section>
  );
}
