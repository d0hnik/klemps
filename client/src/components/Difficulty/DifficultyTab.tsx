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
    <section aria-labelledby="setup-difficulty" className="container-border relative w-full min-w-0 rounded-xl px-6 pt-8 pb-6 lg:max-w-[720px] lg:flex-1">
      <Title id="setup-difficulty" index="2" title={t("difficulty.title")} />
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-8">
        {DIFFICULTIES.map((difficulty) => (
          <DifficultyCard key={difficulty.name} difficulty={difficulty} onSelectDifficulty={onSelectDifficulty} selectedDifficulty={selectedDifficulty} />
        ))}
      </div>
    </section>
  );
}
