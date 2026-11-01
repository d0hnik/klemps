import { useTranslation } from "react-i18next";

type Props = {
  onClick: () => void;
};

export function StartButton({ onClick }: Props) {
  const { t } = useTranslation();

  return (
    <button
      className="secondary-pixel-corners w-full max-w-sm bg-green-700 px-6 py-3 text-2xl text-white button-animation min-h-14 sm:text-3xl"
      type="button"
      style={
        {
          "--border-color": "var(--color-panel)",
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {t("game.startGame")}
    </button>
  );
}
