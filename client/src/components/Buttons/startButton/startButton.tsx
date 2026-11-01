import { useTranslation } from "react-i18next";

type Props = {
  onClick: () => void;
};

export function StartButton({ onClick }: Props) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer rounded border-2 border-amber-200 bg-amber-300 px-8 py-3 text-2xl text-teal-950 hover:bg-amber-200 sm:w-auto"
    >
      {t("game.startGame")}
    </button>
  );
}
