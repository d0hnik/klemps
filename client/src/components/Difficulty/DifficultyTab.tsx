import { useTranslation } from "react-i18next";
import type { DifficultyName } from "../../entities/difficulty/difficulty";
import { EASY_DIFFICULTY, HARD_DIFFICULTY } from "../../entities/difficulty/difficulty.config";
import { Title } from "../Title/Title";
import { DifficultyCard } from "./DifficultyCard";

type Props = {
  selectedDifficulty: DifficultyName;
  onSelectDifficulty: (difficultyName: DifficultyName) => void;
};

export function DifficultyTab({ selectedDifficulty, onSelectDifficulty }: Props) {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-w-0 max-w-[720px]">
      <Title index="2" title={t("difficulty.title")} className="z-10" />
      <div className="secondary-pixel-corners grid gap-4 bg-black/15 px-3 pt-8 pb-5 sm:grid-cols-2 sm:px-5">
        <DifficultyCard difficulty={EASY_DIFFICULTY} onSelectDifficulty={onSelectDifficulty} selectedDifficulty={selectedDifficulty} />
        <DifficultyCard difficulty={HARD_DIFFICULTY} onSelectDifficulty={onSelectDifficulty} selectedDifficulty={selectedDifficulty} />
      </div>
    </section>
  );
}
